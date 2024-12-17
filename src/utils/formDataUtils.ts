import { CreateProductT } from "@/types/types";

export function createProductFormData(product: Partial<CreateProductT>) {
  const formData = new FormData();
  formData.append("name", product.name ?? "");
  formData.append("featured", String(product.featured ?? false));
  formData.append("description", product.description ?? "");
  formData.append("price", product.price?.toString() ?? "");
  formData.append("stock", product.stock?.toString() ?? "");
  formData.append("barcode", product.barcode ?? "");
  formData.append("categoryId", product.categoryId ?? "");
  formData.append("tags", product.tags ?? "");
  formData.append("keyFeatures", product.keyFeatures ?? "");
  formData.append("brand", product.brand ?? "");
  formData.append("status", product.status ?? "ACTIVE");
  formData.append("length", product.length?.toString() ?? "");
  formData.append("width", product.width?.toString() ?? "");
  formData.append("height", product.height?.toString() ?? "");
  formData.append("weight", product.weight?.toString() ?? "");

  if (product.images && product.images.length > 0) {
    product.images.forEach((file) => {
      formData.append("images[]", file);
    });
  }
  return formData;
}

export function updateProductFormData(updatedProduct: any) {
  const formData = new FormData();
  Object.entries(updatedProduct).forEach(([key, value]) => {
    if (key === "newImages" && Array.isArray(value)) {
      (value as File[]).forEach((image: File) => {
        formData.append("images[]", image);
      });
    } else if (key === "imageUrls") {
      formData.append(key, JSON.stringify(value));
    } else if (key === "featured" && typeof value === "boolean") {
      formData.append(key, value.toString());
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  return formData;
}

export function createCategoryFormData(category: any) {}
