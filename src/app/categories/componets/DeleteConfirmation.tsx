import React, { useState } from "react";
import ConfirmationModal from "@/app/components/modals/confirmations/ConfirmationModal";
import { Trash2 } from "lucide-react";
import { useDeleteCategory } from "@/hooks/useQueries/category/useDeleteCategory";
import { Category } from "@prisma/client";

interface DeleteConfirmationExampleProps {
  category: Category;
}

const DeleteConfirmation: React.FC<DeleteConfirmationExampleProps> = ({
  category,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCategoryMutation = useDeleteCategory();

  const onDelete = () => {
    deleteCategoryMutation.mutate(category.id, {
      onSuccess: () => {
        console.log("Category deleted successfully");
      },
      onError: (error) => {
        console.error("Error deleting category:", error);
      },
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className=" font-bold">
        <Trash2 size={18} className="hover:text-red-600" />
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={`Confirm Delete: ${category.name}`}
        message={`Are you sure you want to delete ${category.name}? This action cannot be undone.`}
        cancelText="Cancel"
        confirmButtonClassName={`bg-red-600 hover:bg-red-700 text-white ${
          isDeleting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        confirmText={
          <span className="flex items-center justify-center">
            {isDeleting ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <Trash2 size={18} className="mr-2" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </span>
        }
      />
    </>
  );
};

export default DeleteConfirmation;
