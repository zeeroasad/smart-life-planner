import { config, refreshCookieName } from '../config/env.js';
import { successResponse } from '../utils/apiResponse.js';
import { updateProfile, deleteAccount } from '../services/accountService.js';
import { exportUserData } from '../services/exportService.js';
import { logout } from '../services/authService.js';

export async function profile(req, res) { return successResponse(res, await updateProfile(req.user._id, req.body), 'Profile updated.'); }
export async function exportData(req, res) { const result = await exportUserData(req.user._id, req.query.format); if (result.type === 'csv') { res.type('text/csv'); res.setHeader('Content-Disposition', 'attachment; filename="smart-life-planner-export.csv"'); return res.send(result.data); } return successResponse(res, result.data, 'Data export.'); }
export async function removeAccount(req, res) { await logout(req.cookies[refreshCookieName]); await deleteAccount(req.user._id); res.clearCookie(refreshCookieName, { httpOnly: true, secure: config.cookieSecure, sameSite: config.cookieSameSite, path: '/api/auth' }); return successResponse(res, null, 'Account deleted.'); }
