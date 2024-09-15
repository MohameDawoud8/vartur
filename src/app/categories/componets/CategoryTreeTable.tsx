"use client";
import React, { useState } from "react";
import { useGetCategoriesList } from "@/hooks/useQueries/category/useGetCategoriesList";
import { ChevronDown, ChevronRight } from "lucide-react";
import DeleteConfirmation from "./DeleteConfirmation";
import Link from "next/link";
import { Category } from "@prisma/client";
import ProductCountDisplay from "@/app/components/ProductCountDisplay";
import CategoryTreeTableSkeleton from "./CategoryTreeTableSkeleton";

interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

interface CategoryRowProps {
  category: CategoryWithChildren;
  level?: number;
}

const CategoryRow: React.FC<CategoryRowProps> = ({ category, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <>
      <tr className="bg-white border-b hover:bg-gray-50">
        <td
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
          style={{ paddingLeft: `${level * 20 + 16}px` }}
        >
          <div className="flex items-center">
            {hasChildren && (
              <button onClick={() => setIsOpen(!isOpen)} className="mr-2">
                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            )}
            {!hasChildren && <span className="w-6"></span>}
            <Link
              href={`/categories/${category.id}`}
              className="hover:text-black text-gray-600"
            >
              {category.name}
            </Link>
          </div>
        </td>
        <td className="px-6 py-4 text-center">
          <ProductCountDisplay categoryId={category.id} />
        </td>
        <td className="px-6 py-4 text-right">
          <DeleteConfirmation category={category} />
        </td>
      </tr>
      {isOpen &&
        hasChildren &&
        category.children.map((child) => (
          <CategoryRow key={child.id} category={child} level={level + 1} />
        ))}
    </>
  );
};

export default function CategoryTreeTable() {
  const { data: categories, isLoading } = useGetCategoriesList();

  const buildCategoryTree = (
    categories: Category[]
  ): CategoryWithChildren[] => {
    const categoryMap: { [key: number]: CategoryWithChildren } = {};
    const rootCategories: CategoryWithChildren[] = [];

    categories.forEach((category) => {
      categoryMap[category.id] = { ...category, children: [] };
    });

    categories.forEach((category) => {
      if (category.parentId) {
        const parent = categoryMap[category.parentId];
        if (parent) {
          parent.children.push(categoryMap[category.id]);
        }
      } else {
        rootCategories.push(categoryMap[category.id]);
      }
    });

    return rootCategories;
  };

  const categoryTree = categories ? buildCategoryTree(categories) : [];

  if (isLoading) {
    return <CategoryTreeTableSkeleton />;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
          Our Categories
          <p className="mt-1 text-sm font-normal text-gray-500">
            Explore our category hierarchy. Click on the arrows to expand or
            collapse subcategories.
          </p>
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Total Product Count
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {categoryTree.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
