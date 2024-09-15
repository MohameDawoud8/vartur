import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Image } from "lucide-react";

interface ViewProductImageModalProps {
  imageUrl: string;
  productName: string;
}

const ViewProductImageModal: React.FC<ViewProductImageModalProps> = ({
  imageUrl,
  productName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  const handleDownload = () => {
    if (imageUrl) {
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          const fileName =
            imageUrl.split("/").pop() ||
            `${productName.replace(/\s+/g, "-").toLowerCase()}.jpg`;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => console.error("Error downloading image:", error));
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-gray-600 hover:text-gray-900 mr-2"
        title={`View ${productName} image`}
      >
        <Image size={20} />
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="modal-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-40"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              key="modal-content"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              className="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl mx-auto my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-full p-2 inline-flex items-center"
                aria-label="Close"
              >
                <X size={24} />
              </button>
              <img
                src={imageUrl}
                alt={productName}
                className="w-full h-auto max-h-[70vh] object-contain mb-4"
              />
              <div className="flex justify-center">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Download size={20} className="mr-2" />
                  Download Image
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ViewProductImageModal;
