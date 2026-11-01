import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function signAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpires
  });
}

export function signRefreshToken(user, tokenId) {
  return jwt.sign({ sub: user._id.toString(), tokenId }, config.jwtRefreshSecret, {
    expiresIn: `${config.refreshAbsoluteHours}h`
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtAccessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.jwtRefreshSecret);
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createOpaqueToken() {
  return crypto.randomBytes(48).toString('hex');
}
