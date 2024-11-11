import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";
import { categorySchema, updateCategorySchema } from "../lib/validation";
import { NextRequest } from "next/server";
import { CategoryValidationT } from "@/types/types";
import { capitalizeFirstLetter } from "@/lib/utils";

export async function getAllCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching categories", error.message);
      throw new Error(`Error fetching categories ${error.message}`);
    } else {
      console.error("Unknown error occurred while fetching categories");
      throw new Error("Unknown error occurred while fetching categories");
    }
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    return category;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching category", error.message);
      throw new Error(`Error fetching category ${error.message}`);
    } else {
      console.error("Error fetching category");
      throw new Error("Error fetching category");
    }
  }
}

export async function createCategory(data: CategoryValidationT) {
  try {
    const { subcategories, ...categoryData } = data;
    const category = await prisma.category.create({
      data: {
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      console.error(
        `Conflict: Category with this unique field already exists.`
      );
      throw new Error(
        "Conflict: Category with this unique field already exists."
      );
    } else if (error instanceof Error) {
      console.error(`Error creating category: ${error.message}`);
      throw new Error(`Error creating category: ${error.message}`);
    } else {
      console.error("Unknown error occurred while creating the category");
      throw new Error("Unknown error occurred while creating the category");
    }
  }
}
export async function updateCategory(id: string, data: CategoryValidationT) {
  const { subcategories, ...categoryData } = data;
  try {
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
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // P2002 is the Prisma error code for unique constraint violation
      console.error(
        `Conflict: Category with this unique field already exists.`
      );
      throw new Error(
        "Conflict: Category with this unique field already exists."
      );
    } else if (error instanceof Error) {
      console.error(`Error updating category: ${error.message}`);
      throw new Error(`Error updating category: ${error.message}`);
    } else {
      console.error("Unknown error occurred while updating the category");
      throw new Error("Unknown error occurred while updating the category");
    }
  }
}

export async function deleteCategory(id: string) {
  try {
    const deletedCategory = await prisma.category.delete({ where: { id: id } });
    if (!deleteCategory) {
      throw new Error("Category not found");
    }
    return deletedCategory;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error deleting category with id ${id}: ${error.message}`);
      throw new Error(`Error deleting category: ${error.message}`);
    } else {
      console.error(`Unknown error deleting category with id ${id}`);
      throw new Error("Unknown error occurred while deleting the category");
    }
  }
}

export async function categoryValidation(
  request: NextRequest,
  method: "POST" | "PUT"
): Promise<CategoryValidationT> {
  const formData = await request.formData();
  // Extract fields and ensure they are strings
  const name = formData.get("name")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const parentId = formData.get("parentId")?.toString().trim() || null;

  // Handle `subcategories` safely as a string first
  const subcategoriesField = formData.get("subcategories");
  let subcategories: string[] = [];

  if (typeof subcategoriesField === "string") {
    subcategories = JSON.parse(subcategoriesField) as string[];
  }

  // Handle `tags` similarly
  const tagsField = formData.get("tags");
  let tags: string[] = [];

  if (typeof tagsField === "string") {
    tags = tagsField
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  }

  // Capitalize first letter of name and description
  const capitalizedName = capitalizeFirstLetter(name);
  const capitalizedDescription = capitalizeFirstLetter(description);

  // Extract file
  const file = formData.get("image") as File | null;

  // Use Partial<CategoryValidationT> for temporary incomplete type
  let data: Partial<CategoryValidationT> = {};

  // Conditionally add fields to data if they have valid values
  if (capitalizedName) {
    data.name = capitalizedName;
  }
  if (capitalizedDescription) {
    data.description = capitalizedDescription;
  }
  if (parentId) {
    data.parentId = parentId;
  }
  if (tags.length > 0) {
    data.tags = tags;
  }
  if (subcategories.length > 0) {
    data.subcategories = subcategories;
  }

  // Conditionally handle file
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(" ", "_");
    const filePath = path.join(process.cwd(), "public/uploads", filename);
    const imageUrl = `/uploads/categories/${filename}`;

    data.imageUrl = imageUrl; // Add imageUrl to data if file exists

    // Save the image to disk
    const uint8Array = new Uint8Array(buffer);
    await writeFile(filePath, uint8Array);
  }
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
