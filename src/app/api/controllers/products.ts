import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { NextRequest } from "next/server";

export async function getAllProducts() {
  try {
    return await prisma.product.findMany();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching products", error.message);
      throw new Error(`Error fetching products ${error.message}`);
    } else {
      console.error("Unknown error occurred while fetching products");
      throw new Error("Unknown error occurred while fetching products");
    }
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) throw new Error(`product with id ${id} not found`);
    return product;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching product", error.message);
      throw new Error(`Error fetching product ${error.message}`);
    } else {
      console.error("Error fetching product");
      throw new Error("Error fetching product");
    }
  }
}

export async function createProduct(data: any) {
  try {
    const product = prisma.product.create({
      data: data,
    });
    return product;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      console.error(`Conflict: Product with this unique field already exists.`);
      throw new Error(
        "Conflict: Product with this unique field already exists."
      );
    } else if (error instanceof Error) {
      console.error(`Error creating product: ${error.message}`);
      throw new Error(`Error creating product: ${error.message}`);
    } else {
      console.error("Unknown error occurred while creating the product");
      throw new Error("Unknown error occurred while creating the product");
    }
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const updatedProduct = await prisma.product.update({
      where: {
        id: id,
      },
      data: data,
    });
    if (!updatedProduct) throw new Error("product not found");
    return updatedProduct;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // P2002 is the Prisma error code for unique constraint violation
      console.error(`Conflict: Product with this unique field already exists.`);
      throw new Error(
        "Conflict: Product with this unique field already exists."
      );
    } else if (error instanceof Error) {
      console.error(`Error updating product: ${error.message}`);
      throw new Error(`Error updating product: ${error.message}`);
    } else {
      console.error("Unknown error occurred while updating the product");
      throw new Error("Unknown error occurred while updating the product");
    }
  }
}

export async function deleteProduct(id: string) {
  try {
    const deletedProduct = await prisma.product.delete({ where: { id: id } });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error deleting product with id ${id}: ${error.message}`);
      throw new Error(`Error deleting product: ${error.message}`);
    } else {
      console.error(`Unknown error deleting product with id ${id}`);
      throw new Error("Unknown error occurred while deleting the product");
    }
  }
}

export async function productValidation(
  request: NextRequest,
  method: "POST" | "PUT"
) {
  
}

