import axios from "axios";
import {
  createProductFormData,
  updateProductFormData,
} from "@/utils/formDataUtils";
import { CreateProductT } from "@/types/types";

export async function sendProduct(product: Partial<CreateProductT>) {
  const formData = createProductFormData(product);
  return await axios.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function getAllProducts() {
  return;
}
export async function sendUpdateProduct(product: any, id: string) {
  const formData = updateProductFormData(product);
  return await axios.put(`/api/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function frontGetProductById() {

}
