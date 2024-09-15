import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("🚀 ~ id:", id);

  if (typeof id !== "string") {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    const totalCount = await getTotalProductCount(parseInt(id));
    return NextResponse.json({ totalCount });
  } catch (error) {
    console.error("Error fetching total product count:", error);
    return NextResponse.json(
      { error: "Error fetching total product count" },
      { status: 500 }
    );
  }
}

async function getTotalProductCount(categoryId: number): Promise<number> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      products: true,
      children: true,
    },
  });

  if (!category) {
    return 0;
  }

  let totalCount = category.products.length;

  // Recursive function to count products in all nested categories
  const countNestedProducts = async (parentId: number): Promise<number> => {
    const children = await prisma.category.findMany({
      where: { parentId },
      include: {
        products: true,
        children: true,
      },
    });

    let count = 0;
    for (const child of children) {
      count += child.products.length;
      if (child.children && child.children.length > 0) {
        count += await countNestedProducts(child.id);
      }
    }
    return count;
  };

  totalCount += await countNestedProducts(category.id);

  return totalCount;
}
