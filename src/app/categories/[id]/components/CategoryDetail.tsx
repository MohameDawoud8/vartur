"use client";

import React, { Suspense, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ArrowLeft, ChevronRight, Layers, Package } from "lucide-react";
import Link from "next/link";

// Assuming you have these hooks and types defined
import { useGetCategoryById } from "@/hooks/useQueries/category/useGetCategoryById";
import { useGetProductsByCategory } from "@/hooks/useQueries/category/useGetProductsByCategory";
import dynamic from "next/dynamic";
import CategoryDetailSkeleton from "./CategoryDetailSkeleton";
import CreateProductModal from "@/app/components/modals/creations/CreateProductModal";
import ViewProductImageModal from "@/app/components/modals/confirmations/ViewProductImageModal";

const ProductsTable = dynamic(() => import("./ProductsTable"), {
  loading: () => <p>Loading products...</p>,
});

const CategoryDetail: React.FC = () => {
  // Router Params
  const params = useParams();
  const id = params.id as string;

  // React State
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] =
    useState(false);

  // React Query
  const { data: category, isLoading: isCategoryLoading } =
    useGetCategoryById(id);
  const { data: products, isLoading: isProductsLoading } =
    useGetProductsByCategory(id);

  // Loading State
  if (isCategoryLoading || isProductsLoading) {
    return <CategoryDetailSkeleton />;
  }

  // Category not found
  if (!category) {
    return <div className="text-center p-4">Category not found</div>;
  }

  return (
    <>
      {/* Modal */}
      <CreateProductModal
        isOpen={isCreateProductModalOpen}
        onClose={() => setIsCreateProductModalOpen(false)}
        initialCategoryId={String(category.id)}
      />

      <div className="container mx-auto p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link
              href="/categories"
              className="hover:text-black transition-colors duration-200"
            >
              Categories
            </Link>
            <ChevronRight size={16} className="mx-2" />
            {category.parent && (
              <>
                <Link
                  href={`/categories/${category.parent.id}`}
                  className="hover:text-black transition-colors duration-200"
                >
                  {category.parent.name}
                </Link>
                <ChevronRight size={16} className="mx-2" />
              </>
            )}
            <span className="font-semibold text-black">{category.name}</span>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6 mt-3">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold flex items-center">
              {category.name}
            </h1>
            <ViewProductImageModal
              imageUrl={category.picture || ""}
              productName={category.name}
            />
          </div>
          {category.parent && (
            <p className="text-gray-600 mb-2">
              Parent Category: {category.parent.name}
            </p>
          )}
          <p className="text-gray-600 text-lg flex items-center">
            <Package className="mr-2 text-gray-500" size={24} />
            Total Products:{" "}
            <span className="font-semibold ml-2">{products?.length || 0}</span>
          </p>
        </div>

        <div className="flex justify-end items-center mb-4">
          <button
            type="button"
            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 "
            onClick={() => setIsCreateProductModalOpen(true)}
          >
            <svg
              className="w-5 h-5 my-auto text-gray-500  me-3"
              data-name="Layer 1"
              viewBox="0 0 100 100"
              x="0px"
              y="0px"
            >
              <path d="M68,18H34A14,14,0,0,0,20,32V42a4,4,0,0,0,8,0V32a6,6,0,0,1,6-6H68a6,6,0,0,1,6,6V66a6,6,0,0,1-6,6H58a4,4,0,0,0,0,8H68A14,14,0,0,0,82,66V32A14,14,0,0,0,68,18Z" />
              <path d="M33,52a4,4,0,0,0-4,4v7H22a4,4,0,0,0,0,8h7v7a4,4,0,0,0,8,0V71h7a4,4,0,0,0,0-8H37V56A4,4,0,0,0,33,52Z" />
            </svg>
            Create Product
          </button>
        </div>

        <Suspense fallback={<div>Loading products...</div>}>
          <ProductsTable products={products || []} />
        </Suspense>
      </div>
    </>
  );
};

export default CategoryDetail;
