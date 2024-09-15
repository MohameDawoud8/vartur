import { NextRequest, NextResponse } from "next/server";
import { productRepository } from "@/repositories/product.repository";
import { withErrorHandler, notFound } from "@/lib/errorHandler";
import { validateUpdateProduct } from "@/validators/product.validator";
import * as Yup from "yup";

const idSchema = Yup.object().shape({
  id: Yup.number().integer().positive().required(),
});

const validateId = async (input: { id: number }) => {
  try {
    return await idSchema.validate(input);
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const GET = withErrorHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await validateId({ id: parseInt(params.id) });

    const product = await productRepository.getProductById(id);
    if (!product) return notFound(`Product with id ${id} not found`);

    return NextResponse.json(product);
  }
);

export const PUT = withErrorHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await validateId({ id: parseInt(params.id) });

    const data = await req.json();
    const validatedData = await validateUpdateProduct(data);

    const product = await productRepository.updateProduct(id, validatedData);
    if (!product) return notFound(`Product with id ${id} not found`);

    return NextResponse.json(product);
  }
);

export const DELETE = withErrorHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await validateId({ id: parseInt(params.id) });

    await productRepository.deleteProduct(id);
    return new NextResponse(null, { status: 204 });
  }
);
