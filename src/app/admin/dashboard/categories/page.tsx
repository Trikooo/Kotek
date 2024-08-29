"use client"
import { useState, useEffect } from "react";
import CreateCategory from "@/components/admin/dashboard/categories/CreateCategory";
import AdminLayout from "../../AdminLayout";
import ExistingCategories from "@/components/admin/dashboard/categories/ExistingCategories";

interface Category {
  id: string;
  name: string;
  description?: string;
  parentCategory?: string;
  imageUrl: string;
}

interface CategoryDropDown {
  id: string;
  name: string;
}

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data: Category[] = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Transform categories for dropdown
  const categoriesDropDown: CategoryDropDown[] = categories.map(category => ({
    id: category.id,
    name: category.name
  }));

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 gap-4 lg:gap-8 md:grid-cols-2 w-full">
        <CreateCategory categories={categoriesDropDown} categoriesLoading={loading} error={error}/>
        <ExistingCategories
          categories={categories}
          loading={loading}
          error={error}
        />
      </div>
    </AdminLayout>
  );
}
