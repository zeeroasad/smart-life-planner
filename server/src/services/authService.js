import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { config } from '../config/env.js';
import { LOCKOUT_MINUTES, MAX_FAILED_LOGINS } from '../config/constants.js';
import { createOpaqueToken, hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { ServiceError } from '../utils/serviceError.js';

const normalizeEmail = (email) => email.toLowerCase().trim();
const publicUser = (user) => user.toSafeObject();

function refreshDates(existingAbsolute) {
  const now = Date.now();
  const idle = new Date(now + config.refreshIdleMinutes * 60 * 1000);
  const absolute = existingAbsolute || new Date(now + config.refreshAbsoluteHours * 60 * 60 * 1000);
  return { idleExpiresAt: idle, absoluteExpiresAt: absolute };
}

async function issueSession(user, existingAbsolute = null) {
  const tokenId = (await RefreshToken.create({ userId: user._id, tokenHash: 'pending', ...refreshDates(existingAbsolute) }))._id.toString();
  const refresh = signRefreshToken(user, tokenId);
  await RefreshToken.findByIdAndUpdate(tokenId, { tokenHash: hashToken(refresh) });
  return { accessToken: signAccessToken(user), refreshToken: refresh };
}

export async function register(input) {
  const email = normalizeEmail(input.email);
  if (await User.exists({ email })) throw new ServiceError(409, 'EMAIL_EXISTS', 'An account with that email already exists.');
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({ name: input.name, email, passwordHash, currency: config.defaultCurrency });
  return { user: publicUser(user), ...(await issueSession(user)) };
}

export async function login(input) {
  const user = await User.findOne({ email: normalizeEmail(input.email) }).select('+passwordHash');
  if (!user) throw new ServiceError(401, 'LOGIN_FAILED', 'Email or password is incorrect.');
  if (user.status === 'disabled') throw new ServiceError(403, 'ACCOUNT_DISABLED', 'This account has been disabled.');
  if (user.lockUntil && user.lockUntil > new Date()) throw new ServiceError(423, 'ACCOUNT_LOCKED', 'Too many failed attempts. Try again later.');
  if (user.lockUntil && user.lockUntil <= new Date()) { user.lockUntil = null; user.failedLoginAttempts = 0; }
  const matches = await bcrypt.compare(input.password, user.passwordHash);
  if (!matches) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= MAX_FAILED_LOGINS) {
      user.lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
      user.failedLoginAttempts = 0;
    }
    await user.save();
    throw new ServiceError(401, 'LOGIN_FAILED', 'Email or password is incorrect.');
  }
  user.failedLoginAttempts = 0; user.lockUntil = null; await user.save();
  return { user: publicUser(user), ...(await issueSession(user)) };
}

export async function rotateRefreshToken(rawToken) {
  if (!rawToken) throw new ServiceError(401, 'REFRESH_REQUIRED', 'Refresh cookie is required.');
  let payload;
  try { payload = verifyRefreshToken(rawToken); } catch { throw new ServiceError(401, 'REFRESH_INVALID', 'Refresh session is invalid or expired.'); }
  const stored = await RefreshToken.findById(payload.tokenId);
  if (!stored || stored.revokedAt || stored.tokenHash !== hashToken(rawToken) || stored.idleExpiresAt < new Date() || stored.absoluteExpiresAt < new Date()) throw new ServiceError(401, 'REFRESH_INVALID', 'Refresh session is invalid or expired.');
  const user = await User.findById(payload.sub);
  if (!user || user.status !== 'active') throw new ServiceError(401, 'AUTH_INVALID', 'Your account is not active.');
  stored.revokedAt = new Date(); await stored.save();
  return { user: publicUser(user), ...(await issueSession(user, stored.absoluteExpiresAt)) };
}

export async function logout(rawToken) {
  if (rawToken) await RefreshToken.findOneAndUpdate({ tokenHash: hashToken(rawToken) }, { revokedAt: new Date() });
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email: normalizeEmail(email) });
  if (!user) return;
  const rawToken = createOpaqueToken();
  await PasswordResetToken.create({ userId: user._id, tokenHash: hashToken(rawToken), expiresAt: new Date(Date.now() + 30 * 60 * 1000) });
  const link = `${config.clientUrl}/reset-password?token=${rawToken}`;
  if (config.smtp.host && config.smtp.user && config.smtp.pass) {
    const transporter = nodemailer.createTransport({ host: config.smtp.host, port: config.smtp.port, secure: config.smtp.port === 465, auth: { user: config.smtp.user, pass: config.smtp.pass } });
    await transporter.sendMail({ from: config.smtp.from, to: user.email, subject: 'Smart Life Planner password reset', text: `Reset your password: ${link}` });
  } else {
    console.log(`[password-reset] ${user.email}: ${link}`);
  }
}

export async function resetPassword(rawToken, password) {
  const record = await PasswordResetToken.findOne({ tokenHash: hashToken(rawToken), usedAt: null, expiresAt: { $gt: new Date() } });
  if (!record) throw new ServiceError(400, 'RESET_INVALID', 'This password reset link is invalid or expired.');
  const user = await User.findById(record.userId).select('+passwordHash');
  user.passwordHash = await bcrypt.hash(password, 12); user.failedLoginAttempts = 0; user.lockUntil = null; await user.save();
  record.usedAt = new Date(); await record.save();
  await RefreshToken.updateMany({ userId: user._id, revokedAt: null }, { revokedAt: new Date() });
}

export { publicUser };
