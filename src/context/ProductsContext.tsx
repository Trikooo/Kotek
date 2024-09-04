"use client";
import { useGetAllProducts } from "@/hooks/products/useGetAllProducts";
import { Product } from "@prisma/client";


import React, { createContext, useContext, ReactNode } from "react";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: unknown;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProductContext must be used within ProductProvider");
  }
  return context;
};
export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { products, loading, error } = useGetAllProducts();

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};
