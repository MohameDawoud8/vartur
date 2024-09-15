import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Prisma, Category as PrismaCategory, Product } from "@prisma/client";
import axios from "axios";

interface Category extends PrismaCategory {
  products: Product[];
}

// API function
const createCategory = async (
  categoryData: Prisma.CategoryCreateInput
): Promise<Category> => {
  const { data } = await axios.post("/api/categories", categoryData);
  return data;
};

// Custom hook
export const useCreateCategory = (): UseMutationResult<
  Category,
  Error,
  Prisma.CategoryCreateInput
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      // Invalidate and refetch the categories query
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      // Optionally, you can update the cache directly
      queryClient.setQueryData<Category[]>(["categories"], (oldData) => {
        return oldData ? [...oldData, newCategory] : [newCategory];
      });
    },
  });
};

// Usage example:
// const createCategoryMutation = useCreateCategory();
//
// const handleCreateCategory = (categoryData: CreateCategoryData) => {
//   createCategoryMutation.mutate(categoryData, {
//     onSuccess: (newCategory) => {
//       console.log("Category created:", newCategory);
//     },
//     onError: (error) => {
//       console.error("Error creating category:", error);
//     },
//   });
// };
