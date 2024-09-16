import { NextRequest, NextResponse } from "next/server";
import { categoryRepo } from "@/repositories/category.repository";
import { withErrorHandler, notFound } from "@/lib/errorHandler";
import { validateUpdateCategory } from "@/validators/category.validator";
import * as Yup from "yup";
// import { createValidator } from "@/utils/validator";

const idSchema = Yup.object().shape({
  id: Yup.number().integer().positive().required(),
});

// Validate id using Yup
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

    const category = await categoryRepo.getCategoryById(`${id}`);
    if (!category) return notFound(`Category with id ${id} not found`);

    return NextResponse.json(category);
  }
);

export const PUT = withErrorHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await validateId({ id: parseInt(params.id) });

    const data = await req.json();
    const validatedData = await validateUpdateCategory(data);

    const category = await categoryRepo.updateCategory(id, validatedData);
    if (!category) return notFound(`Category with id ${id} not found`);

    return NextResponse.json(category);
  }
);

export const DELETE = withErrorHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await validateId({ id: parseInt(params.id) });

    await categoryRepo.deleteCategory(id);
    return new NextResponse(null, { status: 204 });
  }
);
