import { errorResponse } from '../utils/apiResponse.js';

export function notFound(req, res) {
  return errorResponse(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} was not found.`);
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  if (res.headersSent) return next(error);
  if (error.code === 11000) return errorResponse(res, 409, 'DUPLICATE', 'That record already exists.');
  return errorResponse(res, error.statusCode || 500, error.code || 'SERVER_ERROR', error.statusCode ? error.message : 'Something went wrong on the server.');
}
