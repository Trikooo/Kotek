import { CategoryName } from "@/types/types";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

export default function useGetAllCategoryNames() {
  const [categoryNames, setCategoryNames] = useState<null | CategoryName[]>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const fetchCategoryNames = async (): Promise<CategoryName[]> => {
    try {
      setLoading(true);
      const response = await axios.get<CategoryName[]>(
        "/api/categories/categoryNames"
      );
      setCategoryNames(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error);
        throw error;
      } else {
        const error = new AxiosError("Unknown error occurred");
        setError(error);
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategoryNames();
  }, []);
  return {
    categoryNames,
    loading,
    error,
  };
}
