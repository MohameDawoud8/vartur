import React from "react";
import { X } from "lucide-react";

interface ConfirmationModalProps {
  /** Controls the visibility of the modal */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
  /** Function to call when the confirmation action is approved */
  onConfirm: () => void;
  /** The title displayed at the top of the modal */
  title: string;
  /** The main message or question presented in the modal */
  message: string;
  /** Text or JSX element for the confirmation button */
  confirmText: React.ReactNode;
  /** Text or JSX element for the cancel button */
  cancelText: React.ReactNode;
  /** Optional CSS class for the confirm button */
  confirmButtonClassName?: string;
  /** Optional CSS class for the cancel button */
  cancelButtonClassName?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  confirmButtonClassName = "bg-blue-600 hover:bg-blue-700 text-white",
  cancelButtonClassName = "bg-white hover:bg-gray-100 text-gray-500",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-auto min-w-[300px]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 text-left pr-8">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center absolute top-4 right-4"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-500 text-left text-wrap">{message}</p>
        </div>
        <div className="flex items-center justify-between space-x-2 flex-wrap h-full ">
          <button
            onClick={onClose}
            className={`${cancelButtonClassName} flex-1 h-full focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 mt-2`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`${confirmButtonClassName} flex-1 h-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
