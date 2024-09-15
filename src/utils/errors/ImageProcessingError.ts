import { AppError, ErrorType } from "@/utils/errors";

export class ImageProcessingError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, ErrorType.IMAGE_PROCESSING, message, details);
  }
}
