import { NextRequest, NextResponse } from "next/server";
import { productRepository } from "@/repositories/product.repository";
import { withErrorHandler } from "@/lib";
import { AppError, ErrorType } from "@/utils/errors";
import * as Yup from "yup";

// Adjust the schema to validate 'id' instead of 'categoryId'
const idSchema = Yup.object().shape({
  id: Yup.number().positive().integer().required(),
});

// Adjust the function to validate 'id' instead of 'categoryId'
const validateId = async (input: { id: string }) => {
  try {
    const id = await idSchema.validate({
      id: Number(input.id),
    });
    return id;
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      throw new AppError(400, ErrorType.VALIDATION, error.message);
    }
    throw error;
  }
};

export const GET = withErrorHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    // Validate 'id' from params
    const { id } = await validateId(params);

    // Use 'id' for fetching products
    const products = await productRepository.getProductsByCategory(id);

    if (products.length === 0) {
      throw new AppError(
        404,
        ErrorType.NOT_FOUND,
        `No products found for category ${id}`
      );
    }

    return NextResponse.json(products);
  }
);
