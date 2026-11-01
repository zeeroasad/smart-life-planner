import * as adminService from '../services/adminService.js';
import { successResponse } from '../utils/apiResponse.js';

export async function accounts(req, res) { return successResponse(res, await adminService.listAccounts(), 'Account metadata.'); }
export async function disable(req, res) { return successResponse(res, await adminService.setAccountStatus(req.params.id, 'disabled'), 'Account disabled.'); }
export async function enable(req, res) { return successResponse(res, await adminService.setAccountStatus(req.params.id, 'active'), 'Account enabled.'); }
