// app/categories/[id]/page.tsx
import { Suspense } from "react";
import CategoryDetail from "./components/CategoryDetail";
import CategoryDetailSkeleton from "./components/CategoryDetailSkeleton";

export default function CategoryDetailPage() {
  return (
    <Suspense fallback={<CategoryDetailSkeleton />}>
      <CategoryDetail />
    </Suspense>
  );
}
