import { $Enums, Category } from "@prisma/client";

export interface CreateProductT {
  id: string;
  name: string;
  description: string;
  price: string;
  images: File[];
  stock: string;
  barcode: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
  tags: string;
  keyFeatures: string[];
  brand: string | null;
  status: $Enums.ProductStatus;
  length: string | null;
  width: string | null;
  height: string | null;
  weight: string | null;
}

export interface CreateCategoryT {
  id: string;
  name: string;
  description?: string;
  image: File;
  tags?: string;
  parentId?: string;
  subcategoryIds: string[];
}

export interface CategoryWithSubcategoriesT extends Category {
  subcategories: Category[];
}

export interface CategoryValidationT {
  name: string;
  description?: string;
  imageUrl: string;
  parentId?: string;
  tags: string[];
  subcategories: string[];
}