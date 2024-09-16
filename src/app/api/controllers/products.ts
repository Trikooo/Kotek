import { Prisma, ProductStatus } from "@prisma/client";
import prisma from "../lib/prisma";
import { NextRequest } from "next/server";
import { capitalizeFirstLetter } from "@/lib/utils";
import { ProductValidationT } from "@/types/types";
import { writeFile } from "fs/promises";
import path from "path";

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
): Promise<ProductValidationT> {
  const formData = await request.formData();

  // Extract fields and ensure they are strings
  const id = formData.get("id")?.toString().trim() || "";
  const name = formData.get("name")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const price = parseInt(formData.get("price")?.toString().trim() || "0", 10);
  const stock = parseInt(formData.get("stock")?.toString().trim() || "0", 10);
  const barcode = formData.get("barcode")?.toString().trim() || null;
  const categoryId = formData.get("categoryId")?.toString().trim() || null;
  const tags =
    formData.getAll("tags")?.map((tag) => tag.toString().trim()) || [];
  const keyFeatures =
    formData
      .getAll("keyFeatures")
      ?.map((feature) => feature.toString().trim()) || [];
  const brand = formData.get("brand")?.toString().trim() || "";
  const status =
    (formData.get("status")?.toString().trim() as ProductStatus) ||
    ("ACTIVE" as ProductStatus);
  const length = parseFloat(formData.get("length")?.toString().trim() || "0");
  const width = parseFloat(formData.get("width")?.toString().trim() || "0");
  const height = parseFloat(formData.get("height")?.toString().trim() || "0");
  const weight = parseFloat(formData.get("weight")?.toString().trim() || "0");

  const files = formData.getAll("images") as File[]; // Assuming "images" is the field name
  const imageUrls: string[] = [];

  for (const file of files) {
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = file.name.replaceAll(" ", "_");
      const filePath = path.join(process.cwd(), "public/uploads", filename);
      const imageUrl = `/uploads/${filename}`;

      // Save the image to disk
      await writeFile(filePath, buffer);

      imageUrls.push(imageUrl); // Collect the URL
    }
  }

  // Prepare data object
  const data: Partial<ProductValidationT> = {
    name: capitalizeFirstLetter(name),
    description: capitalizeFirstLetter(description),
    price,
    stock,
    barcode,
    categoryId,
    tags,
    keyFeatures,
    brand,
    status,
    length,
    width,
    height,
    weight,
    imageUrls,
  };

  // Validate data with the appropriate schema based on request method
  updateProductSchema.parse(data as ProductValidationT);

  return data as ProductValidationT;
}
