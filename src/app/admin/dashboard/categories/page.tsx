
"use client";
import AdminLayout from "../../AdminLayout";
import ExistingCategories from "@/components/admin/dashboard/categories/ExistingCategories";
import { CategoryProvider } from "@/context/CategoriesContext";

export default function Page() {
  return (
    <CategoryProvider>
      <AdminLayout>
        <div className="w-full">
          <ExistingCategories />
        </div>
      </AdminLayout>
    </CategoryProvider>
  );
}
