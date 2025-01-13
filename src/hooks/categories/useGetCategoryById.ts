import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CategoryWith2Subcategories, CategoryWithSubcategoriesT } from "@/types/types";

const fetchCategoryById = async (
  id: string
): Promise<CategoryWith2Subcategories> => {
  const { data } = await axios.get(`/api/categories/${id}`);
  return data;
};

export function useGetCategoryById(id: string) {
  const {
    data: category,
    isLoading: loading,
    error,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategoryById(id),
    enabled: !!id, // Only run query if `id` is truthy
  });

  return {
    category,
    loading,
    error: isError ? (error as Error).message : null,
    refetch,
  };
}
