import { errorResponse } from '../utils/apiResponse.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const message = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
      return errorResponse(res, 400, 'VALIDATION_ERROR', message);
    }
    req[source] = result.data;
    return next();
  };
}
