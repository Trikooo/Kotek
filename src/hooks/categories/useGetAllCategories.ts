import { CategoryWithSubcategoriesT } from "@/types/types";
import { useEffect, useState, useCallback } from "react";

export function useGetAllCategories() {
  const [categories, setCategories] = useState<CategoryWithSubcategoriesT[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/categories");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: CategoryWithSubcategoriesT[] = await response.json();
      setCategories(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
