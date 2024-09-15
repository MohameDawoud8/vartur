import { NextRequest, NextResponse } from "next/server";
import { productRepository } from "@/repositories/product.repository";
import { withErrorHandler } from "@/lib";
import { validateCreateProduct } from "@/validators/product.validator";
import { processImage } from "@/utils/processImage";
import { ImageProcessingError } from "@/utils/errors/ImageProcessingError";

export const GET = withErrorHandler(async () => {
  const products = await productRepository.getAllProducts();
  return NextResponse.json(products);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const data = await req.json();
  const validatedData = await validateCreateProduct(data);

  if (validatedData.picture) {
    try {
      validatedData.picture = await processImage(validatedData.picture);
    } catch (error) {
      if (error instanceof Error) {
        throw new ImageProcessingError(error.message, { originalError: error });
      } else {
        throw new ImageProcessingError(
          "An unknown error occurred while processing the image"
        );
      }
    }
  }

  const product = await productRepository.createProduct(validatedData);
  return NextResponse.json(product, { status: 201 });
});
