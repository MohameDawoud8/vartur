import {
  useQuery,
  UseQueryResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Product } from "@prisma/client";
import axios from "axios";

// API function
const getProductsByCategory = async (
  categoryId: string
): Promise<Product[]> => {
  const { data } = await axios.get(`/api/categories/${categoryId}/products`);
  return data;
};

export const useGetProductsByCategory = (
  categoryId: string
): UseQueryResult<Product[], Error> => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: () => getProductsByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes

    cacheTime: 60 * 60 * 1000, // 1 hour
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["categoryProductCount", categoryId],
        data.length
      );
    },
  });
};

// Usage example:
// const { data: products, isLoading, error } = useGetProductsByCategory(categoryId);
