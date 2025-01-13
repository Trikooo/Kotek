import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CategoryWithSubcategoriesT } from "@/types/types";

import { toast } from "sonner";
import {
  CreateCategoryFormData,
  CreateSubcategoryFormData,
  EditCategoryFormData,
} from "@/validationSchemas/categorySchema";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("tags", data.tags);

      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await axios.post<CategoryWithSubcategoriesT>(
        "/api/categories",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      // This will automatically trigger a refetch of the queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryNames"] });
      toast.success("Category created successfully.");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.message;
        if (errorMessage?.includes("Conflict")) {
          toast.error("A category with this name already exists.");
        } else {
          toast.error("Internal server error.");
        }
      } else {
        toast.error("An unknown error occurred.");
      }
    },
  });
}

export function useCreateSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSubcategoryFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("tags", data.tags);
      formData.append("parentId", data.parentId);
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await axios.post<CategoryWithSubcategoriesT>(
        "/api/categories",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      // This will automatically trigger a refetch of the queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryNames"] });
      toast.success("Subcategory created successfully.");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.message;
        if (errorMessage?.includes("Conflict")) {
          toast.error("A category with this name already exists.");
        } else {
          toast.error("Internal server error.");
        }
      } else {
        toast.error("An unknown error occurred.");
      }
    },
  });
}

export function useEditCategory(categoryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EditCategoryFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("tags", data.tags);

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      const response = await axios.put<CategoryWithSubcategoriesT>(
        `/api/categories/${categoryId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryNames"] });
      toast.success("Category updated successfully.");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.message;
        if (errorMessage?.includes("Conflict")) {
          toast.error("A category with this name already exists.");
        } else {
          toast.error("Internal server error.");
        }
      } else {
        toast.error("An unknown error occurred.");
      }
    },
  });
}
