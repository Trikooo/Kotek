import { Category } from "@prisma/client";
import prisma from "../lib/prisma";

export async function getAllCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        subcategories: true,
      },
      cacheStrategy: { ttl: 60 },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching categories", error.message);
      throw new Error(`Error fetching categories ${error.message}`);
    } else {
      console.error("Error fetching categories");
      throw new Error("Error fetching categories");
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

import { Prisma } from "@prisma/client";
import { unlink, writeFile } from "fs/promises";
import path from "path";
import { categorySchema } from "../lib/validation";
import { NextRequest } from "next/server";
import { CategoryValidationT } from "@/types/types";

export async function createCategory(data: CategoryValidationT) {
  try {
    const { subcategories, ...categoryData } = data;
    const category = await prisma.category.create({
      data: {
        ...categoryData,
        subcategories: {
          connect: subcategories.map((id) => ({ id })),
        },
      },
      include: {
        subcategories: true,
      },
    });

    console.log("Created category:", category);
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
    const updatedCategory = await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        ...categoryData,
        subcategories: {
          connect: subcategories.map((id) => ({ id })),
        },
      },
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
      console.error("Unknown error occurred while creating the category");
      throw new Error("Unknown error occurred while creating the category");
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
  request: NextRequest
): Promise<CategoryValidationT> {
  const formData = await request.formData();
  console.log(formData);

  // Utility function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Extract fields
  let name = formData.get("name")?.toString().trim() || "";
  let description = formData.get("description")?.toString().trim() || "";
  const parentId = formData.get("parentId")?.toString().trim() || "";
  let subcategories = formData.get("subcategories");
  if (subcategories) subcategories = JSON.parse(subcategories as string);
  const tags =
    formData
      .get("tags")
      ?.toString()
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag) || [];

  // Capitalize first letter of name and description
  name = capitalizeFirstLetter(name);
  description = capitalizeFirstLetter(description);

  // Extract and save file
  const file = formData.get("image") as File;
  if (!file) {
    throw new Error("Validation error: Image file is required.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");
  const filePath = path.join(process.cwd(), "public/uploads", filename);
  const imageUrl = `/uploads/${filename}`;
  let data: CategoryValidationT = {
    name: name || "", // Provide a default value to avoid `undefined`
    description: description || "", // Provide a default value if needed
    parentId: parentId || "", // Provide a default value if needed
    tags: tags.length > 0 ? tags : [], // Ensure tags is an empty array if no tags
    subcategories: (subcategories as unknown as string[]) || "", // Provide a default value if needed
    imageUrl: imageUrl, // Ensure imageUrl is always provided
  };

  categorySchema.parse(data);

  await writeFile(filePath, buffer);
  data.imageUrl = imageUrl;

  return data;
}
