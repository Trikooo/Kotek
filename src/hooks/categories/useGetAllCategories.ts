import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CategoryWithSubcategoriesT } from "@/types/types";

// Modify the fetchCategories function to accept a `parent` query parameter
const fetchCategories = async (
  parent: boolean
): Promise<CategoryWithSubcategoriesT[]> => {
  const { data } = await axios.get("/api/categories", {
    params: { parent: parent ? "true" : undefined }, // Only send `parent=true` if `parent` is true
  });
  return data;
};

// Modify the custom hook to accept a `parent` prop with a default value of `false`
export function useGetAllCategories(parent: boolean = false) {
  const {
    data: categories = [], // Provide empty array as default value
    isLoading: loading,
    error,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["categories", parent], // Make sure to include `parent` in the query key
    queryFn: () => fetchCategories(parent), // Pass `parent` to the fetch function
  });

  return {
    categories,
    loading,
    error: isError ? (error as Error).message : null,
    refetch,
  };
}
