"use client";

import CreateCategoryModal from "@/app/components/modals/creations/CreateCategoryModal";
import { useState } from "react";

export default function CreateCategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 "
        onClick={() => setIsModalOpen(true)}
      >
        <svg
          className="w-5 h-5 my-auto text-gray-500  me-3"
          xmlns="http://www.w3.org/2000/svg"
          data-name="Layer 1"
          viewBox="0 0 100 100"
          x="0px"
          y="0px"
        >
          <path d="M68,18H34A14,14,0,0,0,20,32V42a4,4,0,0,0,8,0V32a6,6,0,0,1,6-6H68a6,6,0,0,1,6,6V66a6,6,0,0,1-6,6H58a4,4,0,0,0,0,8H68A14,14,0,0,0,82,66V32A14,14,0,0,0,68,18Z" />
          <path d="M33,52a4,4,0,0,0-4,4v7H22a4,4,0,0,0,0,8h7v7a4,4,0,0,0,8,0V71h7a4,4,0,0,0,0-8H37V56A4,4,0,0,0,33,52Z" />
        </svg>
        Create Category
      </button>

      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
