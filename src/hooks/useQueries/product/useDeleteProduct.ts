import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Product } from "@prisma/client";
import axios from "axios";

// API function
const deleteProduct = async (productId: number): Promise<void> => {
  await axios.delete(`/api/products/${productId}`);
};

// Custom hook
export const useDeleteProduct = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, deletedProductId) => {
      // Invalidate and refetch the products query
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Update the cache for the specific category
      queryClient.setQueriesData<Product[]>(
        { queryKey: ["products"] },
        (oldData) => {
          if (!oldData) return [];
          return oldData.filter((product) => product.id !== deletedProductId);
        }
      );

      // Optionally, update the product count for the category
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
