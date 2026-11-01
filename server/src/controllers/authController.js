import { config, refreshCookieName } from '../config/env.js';
import * as authService from '../services/authService.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

const cookieOptions = { httpOnly: true, secure: config.cookieSecure, sameSite: config.cookieSameSite, maxAge: config.refreshAbsoluteHours * 60 * 60 * 1000, path: '/api/auth' };
function setRefreshCookie(res, token) { res.cookie(refreshCookieName, token, cookieOptions); }
function clearRefreshCookie(res) { res.clearCookie(refreshCookieName, { ...cookieOptions, maxAge: undefined }); }

export async function register(req, res) { const result = await authService.register(req.body); setRefreshCookie(res, result.refreshToken); return createdResponse(res, { accessToken: result.accessToken, user: result.user }, 'Account created.'); }
export async function login(req, res) { const result = await authService.login(req.body); setRefreshCookie(res, result.refreshToken); return successResponse(res, { accessToken: result.accessToken, user: result.user }, 'Signed in.'); }
export async function refresh(req, res) { const result = await authService.rotateRefreshToken(req.cookies[refreshCookieName]); setRefreshCookie(res, result.refreshToken); return successResponse(res, { accessToken: result.accessToken, user: result.user }, 'Session refreshed.'); }
export async function logout(req, res) { await authService.logout(req.cookies[refreshCookieName]); clearRefreshCookie(res); return successResponse(res, null, 'Signed out.'); }
export async function requestReset(req, res) { await authService.requestPasswordReset(req.body.email); return successResponse(res, null, 'If that email exists, a reset link has been sent.'); }
export async function confirmReset(req, res) { await authService.resetPassword(req.body.token, req.body.password); return successResponse(res, null, 'Password reset.'); }
export async function me(req, res) { return successResponse(res, req.user.toSafeObject(), 'Current user.'); }
