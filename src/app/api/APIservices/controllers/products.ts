import { Prisma, ProductStatus } from "@prisma/client";
import prisma from "../lib/prisma";
import { NextRequest } from "next/server";
import { capitalizeFirstLetter } from "@/lib/utils";
import { ProductValidationT } from "@/types/types";
import { writeFile } from "fs/promises";
import path from "path";
import { productSchema, updateProductSchema } from "../lib/validation";
import fs from "fs/promises";
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
    // Fetch the product to get the name or any unique identifier for the directory
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    // Delete the product from the database
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    // If the product has a name or directory identifier, delete the associated image directory
    try{
      await deleteProductImagesDir(product.name);
    }catch(error){
      console.error("couldn't delete product image directory: ", error)
    }


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

  // Extract fields and ensure they are strings
  const name = formData.get("name")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const price = parseInt(formData.get("price")?.toString().trim() || "0", 10);
  const stock = parseInt(formData.get("stock")?.toString().trim() || "0", 10);
  const barcode = formData.get("barcode")?.toString().trim() || null;
  const categoryId = formData.get("categoryId")?.toString().trim() || null;
  const tags =
    (formData.get("tags") as string).split(",").map((tag) => tag.trim()) || [];
  const keyFeatures =
    (formData.get("keyFeatures") as string)
      .split(",")
      .map((keyFeature) => keyFeature.trim()) || [];
  const brand = formData.get("brand")?.toString().trim() || "";
  const status =
    (formData.get("status")?.toString().trim() as ProductStatus) ||
    ("ACTIVE" as ProductStatus);

  const length =
    parseFloat(formData.get("length")?.toString().trim() || "0") || null;
  const width =
    parseFloat(formData.get("width")?.toString().trim() || "0") || null;
  const height =
    parseFloat(formData.get("height")?.toString().trim() || "0") || null;
  const weight =
    parseFloat(formData.get("weight")?.toString().trim() || "0") || null;

  // Handle remainingUrls parsing and validation
  let remainingUrls: string[] = [];
  try {
    const imageUrlsString = formData.get("imageUrls") as string;
    remainingUrls = imageUrlsString ? JSON.parse(imageUrlsString) : [];
  } catch (error) {
    console.error("Error parsing imageUrls:", error);
    remainingUrls = [];
  }

  const files = formData.getAll("images[]") as File[];

  if (method === "PUT") {
    console.log(await deleteImages(name, remainingUrls));
  }

  const imageUrls = [
    ...remainingUrls,
    ...(await saveProductImages(files, name)),
  ];

  console.log("tags: ", tags);
  console.log("keyFeatures: ", keyFeatures);

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

async function saveProductImages(
  files: File[],
  name: string
): Promise<string[]> {
  const imageUrls: string[] = [];
  name = name.replaceAll(" ", "_").toLowerCase();
  const productDir = path.join(process.cwd(), "public/uploads/products", name);
  await ensureDirectoryExists(productDir);

  for (const file of files) {
    if (file) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replaceAll(" ", "_");
        const filePath = path.join(productDir, filename);
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

  return imageUrls;
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch (error) {
    // Directory doesn't exist, so create it
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function deleteImages(dirName: string, imageUrls: string[]) {
  dirName = dirName.replaceAll(" ", "_").toLowerCase();
  const dirPath = path.join(process.cwd(), "public/uploads/products", dirName);

  try {
    const files = await fs.readdir(dirPath);
    const filePaths = files.map((file) =>
      path.join("/uploads/products", dirName, file)
    );

    // TODO: Implement delete functionality here
    // You can use fs.unlink() to delete files that match imageUrls
    let numberOfDeletedImages = 0;
    for (const filePath of filePaths) {
      if (!imageUrls.includes(filePath)) {
        try {
          await fs.unlink(filePath);
          numberOfDeletedImages++;
        } catch (error) {
          console.error("Error deleting file: ", error);
        }
      }
    }
    return numberOfDeletedImages;
  } catch (error) {
    console.error("Error reading directory:", error);
    throw error;
  }
}

async function  deleteProductImagesDir(dirName: string): Promise<void> {
  dirName = dirName.replaceAll(" ", "_").toLowerCase();
  const dirPath = path.join(process.cwd(), "public/uploads/products", dirName);

  try {
    // Check if the directory exists
    await fs.access(dirPath);

    // Remove the directory and its contents
    await fs.rm(dirPath, { recursive: true, force: true });

    console.log(`Deleted directory: ${dirPath}`);
  } catch (error) {
    console.error(`Error deleting directory ${dirPath}:`, error);
    throw new Error(
      `Error deleting directory ${dirPath}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
