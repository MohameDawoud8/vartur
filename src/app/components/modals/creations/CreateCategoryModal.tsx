"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Camera, Upload, Loader2, ChevronDown } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetCategoriesList } from "@/hooks/useQueries/category/useGetCategoriesList";
import { useCreateCategory } from "@/hooks/useQueries/category/useCreateCategory";
import { motion, AnimatePresence } from "framer-motion";

type CategoryInput = {
  name: string;
  picture: FileList | null;
  parentId: string | null;
};

// Define CategoryCreateInput type (adjust this based on your actual API requirements)
type CategoryCreateInput = {
  name: string;
  picture: string | null;
  parent: string | null;
};

// Define the Category type
type Category = {
  id: string;
  name: string;
  parentId: string | null;
  children: Category[];
};

const FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const schema = yup
  .object()
  .shape({
    name: yup.string().required("Category Name is required"),
    picture: yup
      .mixed()
      .required("Category Picture is required")
      .test("fileList", "Please upload a file", (value) => {
        return value instanceof FileList;
      })
      .test("fileSize", "File size is too large", (value) => {
        if (value instanceof FileList && value.length > 0) {
          return value[0].size <= FILE_SIZE;
        }
        return true;
      })
      .test("fileFormat", "Unsupported file format", (value) => {
        if (value instanceof FileList && value.length > 0) {
          return SUPPORTED_FORMATS.includes(value[0].type);
        }
        return true;
      }),
    parentId: yup.string().nullable(),
  })
  .required();

const CreateCategoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  // States
  const [isClosing, setIsClosing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Query Store
  const createCategoryMutation = useCreateCategory();
  const { data: categories = [], isLoading, isError } = useGetCategoriesList();

  // React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CategoryInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      picture: null,
      parentId: null,
    },
  });

  const watchPicture = watch("picture");

  useEffect(() => {
    if (watchPicture instanceof FileList && watchPicture.length > 0) {
      const file = watchPicture[0];
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    }
  }, [watchPicture]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit: SubmitHandler<CategoryInput> = async (data) => {
    try {
      let base64Picture = null;
      if (data.picture instanceof FileList && data.picture.length > 0) {
        base64Picture = await convertToBase64(data.picture[0]);
      }

      await createCategoryMutation.mutateAsync({
        name: data.name,
        picture: base64Picture,
        parentId: data.parentId ? data.parentId : null,
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleReset = () => {
    reset();
    setPreviewUrl(null);
  };

  const organizeCategoriesHierarchy = (categories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    categories.forEach((category) =>
      categoryMap.set(category.id, { ...category, children: [] })
    );

    const rootCategories: Category[] = [];
    categoryMap.forEach((category) => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    });

    return rootCategories;
  };

  const renderCategoryOptions = (
    categories: Category[],
    depth: number = 0
  ): JSX.Element[] => {
    return categories.flatMap((category) => {
      const prefix = "\u00A0\u00A0".repeat(depth);
      return [
        <option key={category.id} value={category.id}>
          {prefix + category.name}
        </option>,
        ...(category.children.length > 0
          ? renderCategoryOptions(category.children, depth + 1)
          : []),
      ];
    });
  };

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-40"
        >
          <motion.div
            key="modal-content"
            variants={modalVariants}
            initial="hidden"
            animate={isClosing ? "closing" : "visible"}
            exit="hidden"
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl mx-auto my-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Create New Category
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-full p-2 inline-flex items-center"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="picture"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Category Picture
                </label>
                <div className="flex items-center justify-center w-full">
                  <Controller
                    name="picture"
                    control={control}
                    render={({ field: { onChange, value: _, ...field } }) => (
                      <label
                        htmlFor="dropzone-file"
                        className={`flex flex-col items-center justify-center w-full h-64 border-2 ${
                          errors.picture ? "border-red-500" : "border-gray-300"
                        } border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out`}
                      >
                        {previewUrl ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={previewUrl}
                              alt="Preview"
                              layout="fill"
                              objectFit="cover"
                              className="rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                              <Camera className="w-12 h-12 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF (MAX. 5MB)
                            </p>
                          </div>
                        )}
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files) {
                              onChange(files);
                            }
                          }}
                          accept={SUPPORTED_FORMATS.join(",")}
                          {...field}
                        />
                      </label>
                    )}
                  />
                </div>
                {errors.picture && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.picture.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="mt-1 block w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      placeholder="Enter category name"
                    />
                  )}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="parentId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Parent Category (Optional)
                </label>
                <div className="relative mt-1">
                  <Controller
                    name="parentId"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="block w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm appearance-none"
                        value={field.value || ""} // Ensure value is never null
                      >
                        <option value="">No parent category</option>
                        {!isLoading &&
                          !isError &&
                          categories &&
                          renderCategoryOptions(
                            organizeCategoriesHierarchy(categories)
                          )}
                      </select>
                    )}
                  />
                  <ChevronDown
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
                {errors.parentId && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.parentId.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={createCategoryMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center min-w-[120px]"
                >
                  {createCategoryMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Creating...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateCategoryModal;
