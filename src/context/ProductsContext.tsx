"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useGetAllProducts } from "@/hooks/products/useGetAllProducts";
import { ProductData } from "@/types/types";

const defaultData: ProductData = {
  products: [],
  total: 0,
};

interface ProductContextType {
  data: ProductData;
  loading: boolean;
  error: unknown;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setData: (data: ProductData) => void; // New setter for updating products
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProductContext must be used within ProductProvider");
  }
  return context;
};

export const ProductProvider: React.FC<{
  children: ReactNode;
  initialPage?: number;
  initialPageSize?: number;
}> = ({ children, initialPage = 1, initialPageSize = 10 }) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const {
    data: fetchedData = defaultData,
    loading,
    error,
  } = useGetAllProducts(page, pageSize); // Ensure defaultData is used if undefined
  const [data, setData] = useState<ProductData>(fetchedData); // Local state to manage data

  useEffect(() => {
    setData(fetchedData); // Update local data state whenever fetchedData changes
  }, [fetchedData]);

  return (
    <ProductContext.Provider
      value={{
        data,
        loading,
        error,
        page,
        pageSize,
        setPage,
        setPageSize,
        setData,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
