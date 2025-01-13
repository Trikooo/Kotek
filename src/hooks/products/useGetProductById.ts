import { Category, Product } from "@prisma/client";
import axios from "axios";
import { useState, useEffect } from "react";

export default function useGetProductById(id: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [product, setProduct] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Product & { category: Category }>(
          `/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  return { product, setProduct, loading, error };
}
