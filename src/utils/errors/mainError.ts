export enum ErrorType {
  VALIDATION = "ValidationError",
  NOT_FOUND = "NotFoundError",
  UNAUTHORIZED = "UnauthorizedError",
  FORBIDDEN = "ForbiddenError",
  INTERNAL = "InternalError",
  IMAGE_PROCESSING = "ImageProcessingError",
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public type: ErrorType,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
