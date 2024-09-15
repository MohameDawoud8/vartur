import React from "react";

const CategoryTreeTableSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg animate-pulse">
      <table className="w-full text-sm text-left text-gray-500">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="h-4 bg-gray-200 rounded w-1/4 ml-auto"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="bg-white border-b">
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="h-4 bg-gray-200 rounded w-1/4 ml-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTreeTableSkeleton;
