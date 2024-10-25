import { useEffect, useState } from "react";
import axios from "axios";
import { ProductData } from "@/types/types";

export const useGetAllProducts = (page: number, pageSize: number) => {
  const [data, setData] = useState<ProductData>({ products: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log(loading);
      try {
        const response = await axios.get(
          `/api/products?page=${page}&pageSize=${pageSize}`
        );
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]); // Watch for changes to page and pageSize

  return { data, loading, error };
};
