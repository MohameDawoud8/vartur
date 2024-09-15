import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

const ProductCountDisplay = ({ categoryId }) => {
  const [totalCount, setTotalCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalCount = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/categories/${categoryId}/total-products`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch total count");
        }
        const data = await response.json();
        if (data && typeof data.totalCount === "number") {
          setTotalCount(data.totalCount);
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (error) {
        console.error("Error fetching total count:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalCount();
  }, [categoryId]);

  if (isLoading) {
    return <Loader className="animate-spin inline-block" size={16} />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <p>{totalCount}</p>
    </div>
  );
};

export default ProductCountDisplay;
