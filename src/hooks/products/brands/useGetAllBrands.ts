import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { BrandResponse } from "@/types/types";

export const useBrands = () => {
  const [brands, setBrands] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<BrandResponse>("/api/products/brands");
      setBrands(response.data.brands);
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err);
      } else {
        setError(new axios.AxiosError("An unexpected error occurred"));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []); // Empty dependency array means this runs once on mount

  return {
    brands,
    loading,
    error,
    refetch: fetchBrands,
  };
};
