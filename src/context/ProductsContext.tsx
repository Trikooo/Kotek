"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { PaginationMetadata, ProductSearchParams } from "@/types/types"; // Adjust the import path as needed
import { AxiosError } from "axios";
import { useGetAllProducts } from "@/hooks/products/useGetAllProducts";
import { Product } from "@prisma/client";

// Define the shape of the context
interface ProductsContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  loading: boolean;
  error: AxiosError | null;
  pagination: PaginationMetadata | null;
  loadMoreProducts: () => void;
  resetProducts: (newParams: ProductSearchParams) => void;
  productSearchParams: ProductSearchParams;
  setProductSearchParams: React.Dispatch<
    React.SetStateAction<ProductSearchParams>
  >;
}

// Create the context
export const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

// Create a provider component
export const ProductsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Use the custom hook to get all the products-related state and functions
  const productsState = useGetAllProducts();

  return (
    <ProductsContext.Provider value={productsState}>
      {children}
    </ProductsContext.Provider>
  );
};

// Custom hook to use the Products context
export const useProductsContext = () => {
  const context = useContext(ProductsContext);

  // Throw an error if the hook is used outside of a ProductsProvider
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }

  return context;
};
