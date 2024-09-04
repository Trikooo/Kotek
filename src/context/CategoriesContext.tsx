"use client";

import { useGetAllCategories } from "@/hooks/categories/useGetAllCategories";
import { CategoryWithSubcategoriesT } from "@/types/types";
import { Category } from "@prisma/client";
import React, {
  createContext,
  useContext,
  ReactNode,
} from "react";

interface CategoryContextType {
  categories: CategoryWithSubcategoriesT[];
  categoryOptions: { value: string; label: string }[];
  loading: boolean;
  error: string | null;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider"
    );
  }
  return context;
};

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {categories, loading, error } = useGetAllCategories()

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <CategoryContext.Provider
      value={{ categories, categoryOptions, loading, error }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
