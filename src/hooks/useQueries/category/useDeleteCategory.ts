import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Category as PrismaCategory, Product } from "@prisma/client";
import axios from "axios";

interface Category extends PrismaCategory {
  products: Product[];
}

// API function
const deleteCategory = async (categoryId: number): Promise<void> => {
  await axios.delete(`/api/categories/${categoryId}`);
};

// Custom hook
export const useDeleteCategory = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (_, deletedCategoryId) => {
      console.log(
        "🚀 ~ useDeleteCategory ~ deletedCategoryId:",
        deletedCategoryId
      );
      // Invalidate and refetch the categories query
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      // Optionally, you can update the cache directly
      queryClient.setQueryData<Category[]>(["categories"], (oldData) => {
        if (!oldData) return [];

        return oldData
          .map((category) => {
            if (category.parentId === deletedCategoryId) {
              // If this category's parent was deleted, set parentId to null
              return { ...category, parentId: null };
            }
            return category;
          })
          .filter((category) => category.id !== deletedCategoryId);
      });
    },
  });
};

// Usage example:
// const deleteCategoryMutation = useDeleteCategory();
//
// const handleDeleteCategory = (categoryId: string) => {
//   deleteCategoryMutation.mutate(categoryId, {
//     onSuccess: () => {
//       console.log("Category deleted successfully");
//     },
//     onError: (error) => {
//       console.error("Error deleting category:", error);
//     },
//   });
// };
