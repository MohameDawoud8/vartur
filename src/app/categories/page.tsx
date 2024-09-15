import CategoryTreeTable from "./componets/CategoryTreeTable";
import CreateCategory from "./componets/CreateCategory";

export default function CategoryList() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-end w-full">
        <CreateCategory />
      </div>

      <div className="relative overflow-x-auto shadow-md w-full sm:rounded-lg">
        <CategoryTreeTable />
      </div>
    </div>
  );
}
