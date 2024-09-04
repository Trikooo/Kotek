import { CategoryWithSubcategoriesT } from "@/types/types";
import { useEffect, useState } from "react";


export function useGetAllCategories(){
  const [categories, setCategories] = useState<CategoryWithSubcategoriesT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data: CategoryWithSubcategoriesT[] = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  console.log(categories)

  return {
    categories, loading, error
  }
}