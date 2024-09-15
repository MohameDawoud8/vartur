import { AppError, ErrorType } from "@/utils/errors";
import { NextRequest, NextResponse } from "next/server";

export interface ErrorResponse {
  message: string;
  details?: unknown;
}

export const createErrorResponse = (
  error: AppError
): NextResponse<ErrorResponse> => {
  console.error(`[${error.type}] ${error.message}`, error.details || "");

  const body: ErrorResponse = {
    message: error.message,
  };

  if (process.env.NODE_ENV === "development") {
    body.details = error.details;
  }

  return NextResponse.json(body, { status: error.statusCode });
};

type HandlerFunction = (
  req: NextRequest,
  context: { params: { id: string } }
) => Promise<NextResponse>;

export const withErrorHandler = (handler: HandlerFunction): HandlerFunction => {
  return async (req: NextRequest, context: { params: { id: string } }) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof AppError) {
        return createErrorResponse(error);
      }

      if (error instanceof Error) {
        if (error.message.includes("ValidationError")) {
          return createErrorResponse(
            new AppError(
              400,
              ErrorType.VALIDATION,
              "Invalid input",
              error.message
            )
          );
        }

        if (error.name === "NotFoundError") {
          return createErrorResponse(
            new AppError(404, ErrorType.NOT_FOUND, error.message)
          );
        }
      }

      console.error("Unexpected error:", error);
      return createErrorResponse(
        new AppError(
          500,
          ErrorType.INTERNAL,
          "An unexpected error occurred",
          error
        )
      );
    }
  };
};
export const notFound = (message: string, details?: unknown) => {
  throw new AppError(404, ErrorType.NOT_FOUND, message, details);
};

export const unauthorized = (message: string, details?: unknown) => {
  throw new AppError(401, ErrorType.UNAUTHORIZED, message, details);
};

export const forbidden = (message: string, details?: unknown) => {
  throw new AppError(403, ErrorType.FORBIDDEN, message, details);
};

export const badRequest = (message: string, details?: unknown) => {
  throw new AppError(400, ErrorType.VALIDATION, message, details);
};

export const internalError = (message: string, details?: unknown) => {
  throw new AppError(500, ErrorType.INTERNAL, message, details);
};

// Define a schema for id validation using Yup
