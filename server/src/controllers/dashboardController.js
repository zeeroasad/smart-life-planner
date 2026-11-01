import { successResponse } from '../utils/apiResponse.js';
import { getDashboard } from '../services/dashboardService.js';

export async function dashboard(req, res) { return successResponse(res, await getDashboard(req.user, req.query.month || new Date().toISOString().slice(0, 7)), 'Dashboard data.'); }
