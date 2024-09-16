import { NextRequest, NextResponse } from "next/server";
import { categoryRepo } from "@/repositories/category.repository";
import { withErrorHandler } from "@/lib";
import { validateCreateCategory } from "@/validators/category.validator";
import { processImage } from "@/utils/processImage";

export const GET = withErrorHandler(async () => {
  const categories = await categoryRepo.getAllCategories();
  return NextResponse.json(categories);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const data = await req.json();
  const validatedData = await validateCreateCategory(data);

  if (validatedData.picture) {
    try {
      validatedData.picture = await processImage(validatedData.picture);
    } catch (error: any) {
      return NextResponse.json(
        { error: "Error processing image: " + error.message },
        { status: 400 }
      );
    }
  }

  const category = await categoryRepo.createCategory(validatedData);
  return NextResponse.json(category, { status: 201 });
});
