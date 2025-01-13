"use client";
import AdminLayout from "../../AdminLayout";
import ExistingCategories from "@/components/admin/dashboard/categories/ExistingCategories";

export default function Page() {
  return (
    <AdminLayout>
      <div className="w-full">
        <ExistingCategories />
      </div>
    </AdminLayout>
  );
}
