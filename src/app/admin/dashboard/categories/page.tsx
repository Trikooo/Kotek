import CreateCategory from "@/components/admin/dashboard/categories/CreateCategory";
import AdminLayout from "../../AdminLayout";
import ExistingCategories from "@/components/admin/dashboard/categories/ExistingCategories";

export default function page() {
  return (
    <AdminLayout>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <CreateCategory />
          </div>
          <div className="flex flex-col gap-4">
            <ExistingCategories />
          </div>
        </div>

    </AdminLayout>
  );
}
