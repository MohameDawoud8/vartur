import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Category as PrismaCategory, Product } from "@prisma/client";
import axios from "axios";

interface Category extends PrismaCategory {
  products: Product[];
}

// API function
const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get("/api/categories");
  return data;
};

// Custom hook
export const useGetCategoriesList = (): UseQueryResult<Category[], Error> => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Usage example:
// const { data: categories, isLoading, isError, error } = useCategories();
