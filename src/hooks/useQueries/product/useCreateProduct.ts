import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Prisma, Product } from "@prisma/client";
import axios from "axios";

type CreateProductInput = Omit<Prisma.ProductCreateInput, "category"> & {
  categoryId: string;
};

// API function
const createProduct = async (
  productData: CreateProductInput
): Promise<Product> => {
  const { data } = await axios.post("/api/products", productData);
  return data;
};

// Custom hook
export const useCreateProduct = (): UseMutationResult<
  Product,
  Error,
  CreateProductInput
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (newProduct) => {
      // Invalidate and refetch the products query
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Optionally, update the cache directly
      queryClient.setQueryData<Product[]>(["products"], (oldData) => {
        return oldData ? [...oldData, newProduct] : [newProduct];
      });

      // If you have a query for products by category, you might want to update that as well
      queryClient.invalidateQueries({
        queryKey: ["products", newProduct.categoryId],
      });
    },
  });
};
