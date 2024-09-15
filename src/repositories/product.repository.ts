import prisma from "@/lib/prisma";

class ProductRepo {
  async getAllProducts() {
    try {
      return await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          picture: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  }

  async getProductById(id: number) {
    try {
      return await prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          picture: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  }

  async createProduct(data: {
    name: string;
    picture?: string;
    categoryId: number;
  }) {
    try {
      return await prisma.product.create({
        data,
        select: {
          id: true,
          name: true,
          picture: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(
    id: number,
    data: { name?: string; picture?: string; categoryId?: number }
  ) {
    try {
      return await prisma.product.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          picture: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id: number) {
    try {
      await prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  }

  async getProductsByCategory(categoryId: number) {

    try {
      const products = await prisma.product.findMany({
        where: { categoryId: categoryId },
        select: {
          id: true,
          name: true,
          picture: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return products;
    } catch (error) {
      console.error(
        `Error fetching products for category ${categoryId}:`,
        error
      );
      throw error;
    }
  }
}

export const productRepository = new ProductRepo();
