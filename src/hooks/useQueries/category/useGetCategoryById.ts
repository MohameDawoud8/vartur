import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Category as PrismaCategory, Product } from "@prisma/client";
import axios from "axios";

interface Category extends PrismaCategory {
  products: Product[];
  parent?: Category;
}

// API function
const getCategoryById = async (id: string): Promise<Category> => {
  const { data } = await axios.get(`/api/categories/${id}`);
  return data;
};

// Custom hook
export const useGetCategoryById = (id?: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id!),
    enabled: !!id,
  });
};

// Usage example:
// const { data: category, isLoading, error } = useGetCategoryById(categoryId);
