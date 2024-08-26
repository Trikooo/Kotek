import { Category } from "@prisma/client";
import prisma from "../lib/prisma";

export interface CategoryData {
  name: string;
  description?: string;
  imageUrl: string;
  parentId?: string;
  tags?: string[];
}

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

export async function createCategory(data: Category) {
  try {
    console.log(data);
    return await prisma.category.create({
      data: {
        ...data,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error creating category: ${error.message}`);
      throw new Error(`Error creating category: ${error.message}`);
    } else {
      console.error("Unknown error occurred while creating the category");
      throw new Error("Unknown error occurred while creating the category");
    }
  }
}

export async function updateCategory(id: string, data: Partial<CategoryData>) {
  try {
    const updatedCategory = await prisma.category.update({
      where: {
        id: id,
      },
      data,
    });
    if (!updatedCategory) {
      throw new Error(`Category with id ${id} not found`);
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
