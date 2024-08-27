import { Category } from "@prisma/client";
import prisma from "../lib/prisma";

export async function getAllCategories() {
  try {
    return await prisma.category.findMany();
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

export async function createCategory(data: Category) {
  try {
    console.log(data);
    return await prisma.category.create({
      data: {
        ...data,
      },
    });
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
      console.error(`Error creating category: ${error.message}`);
      throw new Error(`Error creating category: ${error.message}`);
    } else {
      console.error("Unknown error occurred while creating the category");
      throw new Error("Unknown error occurred while creating the category");
    }
  }
}

export async function updateCategory(id: string, data: Partial<Category>) {
  try {
    const updatedCategory = await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });
    if (!updatedCategory) {
      throw new Error("Category not found");
    }
    return updatedCategory;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error updating category with id ${id}: ${error.message}`);
      throw new Error(`Error updating category: ${error.message}`);
    } else {
      console.error(`Unknown error updating category with id ${id}`);
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
  request: NextRequest
): Promise<Partial<Category>> {
  const formData = await request.formData();

  // Utility function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Extract fields
  let name = formData.get("name")?.toString().trim() || "";
  let description = formData.get("description")?.toString().trim() || "";
  const parentId = formData.get("parentId")?.toString().trim() || "";
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
  let data: Partial<Category> = {
    ...(name && { name }),
    ...(description && { description }),
    ...(parentId && parentId !== "" && { parentId }),
    ...(tags.length > 0 && { tags }),
    imageUrl: imageUrl
  };
  categorySchema.parse(data);

  await writeFile(filePath, buffer);
  data.imageUrl = imageUrl;


  return data;
}
