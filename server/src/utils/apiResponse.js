export function successResponse(res, data = null, message = 'OK', meta = {}) {
  return res.status(200).json({ success: true, data, message, meta });
}

export function createdResponse(res, data, message = 'Created', meta = {}) {
  return res.status(201).json({ success: true, data, message, meta });
}

export function errorResponse(res, status, code, message) {
  return res.status(status).json({ success: false, error: { code, message } });
}
