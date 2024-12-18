import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { categorySchema, updateCategorySchema } from "../lib/validation";
import { NextRequest } from "next/server";
import { CategoryValidationT } from "@/types/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { r2Client } from "./r2";

export async function getAllCategories() {
  return await prisma.category.findMany({
    include: {
      subcategories: true,
    },
  });
}
export async function getAllCategoryNames() {
  const categoryNames = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return categoryNames;
}

export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });
  if (!category) {
    throw new Error(`Category with id ${id} not found`);
  }
  return category;
}

export async function createCategory(id: string, data: CategoryValidationT) {
  try {
    const { subcategories, ...categoryData } = data;
    const category = await prisma.category.create({
      data: {
        id: id,
        ...categoryData,
        ...(subcategories && {
          subcategories: {
            connect: subcategories.map((id) => ({ id })),
          },
        }),
      },
      include: {
        subcategories: true,
      },
    });

    return category;
  } catch (error) {
    r2Client.deleteImages([data.imageUrl]);
    throw error;
  }
}
export async function updateCategory(id: string, data: CategoryValidationT) {
  const { subcategories, ...categoryData } = data;
  const updateData: any = { ...categoryData };

  if (subcategories && subcategories.length > 0) {
    updateData.subcategories = {
      connect: subcategories.map((id) => ({ id })),
    };
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: updateData,
  });
  if (!updatedCategory) {
    throw new Error("Category not found");
  }
  return updatedCategory;
}

export async function deleteCategory(id: string) {
  const categoryToDelete = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });
  if (!categoryToDelete) {
    throw new Error("category not found");
  }
  await r2Client.deleteImages([categoryToDelete.imageUrl]);
  const deletedCategory = await prisma.category.delete({ where: { id: id } });

  return deletedCategory;
}

export async function categoryValidation(
  request: NextRequest,
  method: "POST" | "PUT",
  id: string
): Promise<CategoryValidationT> {
  const formData = await request.formData();

  // Extract form data
  const extractedData = extractCategoryFormData(formData);

  // Handle file upload
  const file = formData.get("image") as File | null;
  const imageUrl = await uploadCategoryImage(file, id);

  const data = prepareCategoryData(
    extractedData,
    imageUrl ? imageUrl[0] : null
  );

  // Validate data with the appropriate schema based on request method
  if (method === "PUT") {
    updateCategorySchema.parse(data as CategoryValidationT);
  } else if (method === "POST") {
    categorySchema.parse(data as CategoryValidationT);
  } else {
    console.error("Method not supported for validation.");
    throw new Error("Method not supported for validation.");
  }

  return data as CategoryValidationT;
}

export function extractCategoryFormData(formData: FormData) {
  const name = formData.get("name")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const parentId = formData.get("parentId")?.toString().trim() || null;

  const subcategoriesField = formData.get("subcategories");
  let subcategories: string[] = [];
  if (typeof subcategoriesField === "string") {
    subcategories = JSON.parse(subcategoriesField) as string[];
  }

  const tagsField = formData.get("tags")?.toString();
  let tags: string[] = [];
  if (tagsField) {
    tags = tagsField.split(",").map((tag) => tag.trim());
  }

  const capitalizedName = capitalizeFirstLetter(name);
  const capitalizedDescription = capitalizeFirstLetter(description);

  return {
    name: capitalizedName,
    description: capitalizedDescription,
    parentId,
    subcategories,
    tags,
  };
}

export async function uploadCategoryImage(file: File | null, id: string) {
  if (!file) return null;

  const prefix = `categories/${id}`;

  const imageUrl = await r2Client.uploadImages([file], prefix);
  return imageUrl;
}

export function prepareCategoryData(
  extractedData: ReturnType<typeof extractCategoryFormData>,
  imageUrl: string | null
): Partial<CategoryValidationT> {
  const { name, description, parentId, subcategories, tags } = extractedData;

  let data: Partial<CategoryValidationT> = {};

  if (name) data.name = name;
  if (description) data.description = description;
  if (parentId) data.parentId = parentId;
  if (tags.length > 0) data.tags = tags;
  if (subcategories.length > 0) data.subcategories = subcategories;
  if (imageUrl) data.imageUrl = imageUrl;

  return data;
}
