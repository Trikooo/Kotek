

import { Product } from "@prisma/client";
import { useEffect, useState } from "react";

export function useGetAllProducts(){
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return {
    products, loading, error
  }
}