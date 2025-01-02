import axios from "axios";
import {
  createProductFormData,
  updateProductFormData,
} from "@/utils/formDataUtils";
import { CreateProductT } from "@/types/types";
import { Product } from "@prisma/client";

export async function sendProduct(product: Partial<CreateProductT>) {
  const formData = createProductFormData(product);
  const response = await axios.post<Product>("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function getAllProducts() {
  return;
}
export async function sendUpdateProduct(product: any, id: string) {
  const formData = updateProductFormData(product);
  const response = await axios.put<Product>(`/api/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function frontGetProductById() {}
