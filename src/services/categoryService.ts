// services/categoryService.ts

import prisma from "@/lib/prisma";

export class CategoryService {
  async getAllCategories() {
    return prisma.category.findMany({
      include: { parent: true, children: true },
    });
  }

  async getCategoryById(id: number) {
    return prisma.category.findUnique({
      where: { id },
      include: { parent: true, children: true },
    });
  }

  async createCategory(data: {
    name: string;
    picture?: string;
    parentId?: number;
  }) {
    return prisma.category.create({
      data: {
        name: data.name,
        picture: data.picture,
        parentId: data.parentId ? parseInt(data.parentId.toString()) : null,
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
    return prisma.category.delete({ where: { id } });
  }
}

export const categoryService = new CategoryService();
