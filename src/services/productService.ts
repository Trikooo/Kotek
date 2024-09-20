import axios from "axios";
import { createProductFormData } from "@/utils/formDataUtils";
import { CreateProductT } from "@/types/types";

export async function sendProduct(product: Partial<CreateProductT>) {
  const formData = createProductFormData(product);
  console.log("inside sendProduct: ",formData.get("images[]"));
  return await axios.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function getAllProducts() {
  return;
}
