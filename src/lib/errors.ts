/**
 * Transport-agnostic error type shared by services, libraries and route
 * handlers. Kept free of framework imports so any layer can throw one.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code: string = 'error'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const Unauthorized = () => new ApiError(401, 'Unauthorized', 'unauthorized');
export const Forbidden = () => new ApiError(403, 'Forbidden', 'forbidden');
export const NotFound = (what = 'Resource') =>
  new ApiError(404, `${what} not found`, 'not_found');
export const BadRequest = (message: string, code = 'bad_request') =>
  new ApiError(400, message, code);
export const ServiceUnavailable = (message: string, code = 'service_unavailable') =>
  new ApiError(503, message, code);
