import axios from "axios";
import { createProductFormData, Product } from "@/utils/formDataUtils";


export async function createProduct(product: Partial<Product>) {
  const formData = createProductFormData(product);
  return await axios.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
