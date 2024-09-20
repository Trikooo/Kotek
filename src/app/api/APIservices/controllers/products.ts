import { Prisma, ProductStatus } from "@prisma/client";
import prisma from "../lib/prisma";
import { NextRequest } from "next/server";
import { capitalizeFirstLetter } from "@/lib/utils";
import { ProductValidationT } from "@/types/types";
import { writeFile } from "fs/promises";
import path from "path";
import { productSchema, updateProductSchema } from "../lib/validation";
import fs from "node:fs";
export async function getAllProducts(page: number, pageSize: number) {
  try {
    // Calculate the offset
    const skip = (page - 1) * pageSize;

    // Fetch products with pagination
    const products = await prisma.product.findMany({
      skip,
      take: pageSize,
    });

    // Get total count of products for pagination calculations
    const total = await prisma.product.count();

    return { products, total };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching products", error.message);
      throw new Error(`Error fetching products: ${error.message}`);
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

export async function createProduct(data: ProductValidationT) {
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
    return deletedProduct;
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
  console.log(formData);
  // Extract fields and ensure they are strings
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

  const lengthValue = formData.get("length");
  const length =
    lengthValue !== null ? parseFloat(lengthValue.toString().trim()) : null;

  const widthValue = formData.get("width");
  const width =
    widthValue !== null ? parseFloat(widthValue.toString().trim()) : null;

  const heightValue = formData.get("height");
  const height =
    heightValue !== null ? parseFloat(heightValue.toString().trim()) : null;

  const weightValue = formData.get("weight");
  const weight =
    weightValue !== null ? parseFloat(weightValue.toString().trim()) : null;

  const files = formData.getAll("images[]") as File[]; // Assuming "images" is the field name
  const imageUrls: string[] = [];
  const productDir = path.join(process.cwd(), "public/uploads/products", name);
  ensureDirectoryExists(productDir);
  for (const file of files) {
    if (file) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replaceAll(" ", "_");
        const filePath = path.join(
          process.cwd(),
          "public/uploads/products",
          name,
          filename
        );
        const imageUrl = `/uploads/products/${name}/${filename}`;

        // Save the image to disk
        await writeFile(filePath, buffer);

        imageUrls.push(imageUrl); // Collect the URL
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
        throw new Error(
          `Failed to process file ${file.name}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  }

  // Prepare data object
  const data: Partial<ProductValidationT> = {
    ...(name && { name: capitalizeFirstLetter(name) }),
    ...(description && { description: capitalizeFirstLetter(description) }),
    ...(price && { price }),
    ...(stock && { stock }),
    ...(barcode && { barcode }),
    ...(categoryId && { categoryId }),
    ...(tags.length > 0 && { tags }),
    ...(keyFeatures.length > 0 && { keyFeatures }),
    ...(brand && { brand }),
    ...(status && { status }),
    ...(length && { length }),
    ...(width && { width }),
    ...(height && { height }),
    ...(weight && { weight }),
    ...(imageUrls.length > 0 && { imageUrls }),
  };

  // Validate data with the appropriate schema based on request method
  if (method === "POST") {
    productSchema.parse(data as ProductValidationT);
  } else if (method === "PUT") {
    updateProductSchema.parse(data as ProductValidationT);
  } else {
    console.error("Method not allowed.");
    throw new Error("Method not allowed.");
  }
  return data as ProductValidationT;
}

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
