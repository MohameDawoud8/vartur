// import { Product } from "@prisma/client";
import DeleteProductConfirmation from "@/app/components/modals/confirmations/DeleteProductConfirmation";
import ViewProductImageModal from "@/app/components/modals/confirmations/ViewProductImageModal";
import { useDeleteProduct } from "@/hooks/useQueries/product/useDeleteProduct";
import { Trash2 } from "lucide-react";
import React, { useCallback } from "react";

export interface Product {
  id: number;
  name: string;
  picture?: string;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductsTableProps {
  products: Product[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => {
  const deleteProductMutation = useDeleteProduct();

  const handleDeleteProduct = useCallback(
    (productId) => {
      deleteProductMutation.mutate(productId, {
        onSuccess: () => {
          setLocalProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== productId)
          );
        },
        onError: (error) => {
          console.error("Error deleting product:", error);
          // Handle error (e.g., show error message to user)
        },
      });
    },
    [deleteProductMutation]
  );

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
          Products in this Category
          <p className="mt-1 text-sm font-normal text-gray-500">
            A list of all the products in this category.
          </p>
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Product Name
            </th>
            <th scope="col" className="px-6 py-3">
              Created At
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((product: Product) => (
              <tr
                key={product.id}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {product.name}
                </td>
                <td className="px-6 py-4">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end me-3 space-x-1">
                  <ViewProductImageModal
                    imageUrl={product.picture || ""}
                    productName={product.name}
                  />
                  <DeleteProductConfirmation
                    product={product}
                    // onDeleteSuccess={() => onDeleteProduct(product.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-white border-b">
              <td colSpan={3} className="px-6 py-4 text-center">
                No products found in this category.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
