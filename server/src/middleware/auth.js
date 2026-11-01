import { User } from '../models/User.js';
import { verifyAccessToken } from '../utils/tokens.js';
import { errorResponse } from '../utils/apiResponse.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return errorResponse(res, 401, 'AUTH_REQUIRED', 'A valid access token is required.');
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user || user.status !== 'active') return errorResponse(res, 401, 'AUTH_INVALID', 'Your session is no longer active.');
    req.user = user;
    return next();
  } catch {
    return errorResponse(res, 401, 'AUTH_INVALID', 'Your session is invalid or expired.');
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return errorResponse(res, 403, 'ADMIN_REQUIRED', 'Administrator access is required.');
  return next();
}
