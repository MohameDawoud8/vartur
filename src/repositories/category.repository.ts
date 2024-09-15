// services/categoryService.ts

import prisma from "@/lib/prisma";

export class CategoryRepo {
  async getAllCategories() {
    return prisma.category.findMany({
      include: { parent: true, children: true },
    });
  }

  async getCategoryById(id: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) },
        include: {
          parent: true,
          children: true,
          products: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      return {
        ...category,
        productsCount: category.products.length,
      };
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  }

  async createCategory(data: {
    name: string;
    picture?: string | undefined;
    parentId?: number | undefined;
  }) {
    return prisma.category.create({
      data: {
        name: data.name,
        picture: data.picture,
        parentId: data.parentId,
      },
      include: { parent: true },
    });
  }

  async updateCategory(
    id: number,
    data: { name?: string; picture?: string; parentId?: number }
  ) {
    return prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        picture: data.picture,
        parentId: data.parentId ? parseInt(data.parentId.toString()) : null,
      },
      include: { parent: true },
    });
  }

  async deleteCategory(id: number) {
    return prisma.$transaction(async (tx) => {
      // Delete all products associated with the category
      await tx.product.deleteMany({
        where: { categoryId: id },
      });

      // Delete the category itself
      const deletedCategory = await tx.category.delete({
        where: { id },
      });

      return deletedCategory;
    });
  }

  async getAllCategoryIds() {
    try {
      const categories = await prisma.category.findMany({
        select: { id: true },
      });

      return categories.map((category) => category.id.toString());
    } catch (error) {
      console.error("Error fetching category IDs:", error);
      throw error;
    }
  }
}

export const categoryRepo = new CategoryRepo();
