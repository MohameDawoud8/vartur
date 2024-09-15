import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useDeleteProduct } from "@/hooks/useQueries/product/useDeleteProduct";
import ConfirmationModal from "./ConfirmationModal";

interface DeleteProductConfirmationProps {
  product: {
    id: number;
    name: string;
  };
  //   onDeleteSuccess: () => void;
}

const DeleteProductConfirmation: React.FC<DeleteProductConfirmationProps> = ({
  product,
  //   onDeleteSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const deleteProductMutation = useDeleteProduct();

  const handleDelete = () => {
    deleteProductMutation.mutate(product.id, {
      onSuccess: () => {
        setIsOpen(false);
        // onDeleteSuccess();
      },
      onError: (error) => {
        console.error("Error deleting product:", error);
        // Handle error (e.g., show error message to user)
      },
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-600 hover:text-red-600 transition-colors duration-200"
      >
        <Trash2 size={18} />
      </button>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete the product "${product.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClassName="bg-red-500 hover:bg-red-700 text-white"
        cancelButtonClassName="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"
      />
    </>
  );
};

export default DeleteProductConfirmation;
