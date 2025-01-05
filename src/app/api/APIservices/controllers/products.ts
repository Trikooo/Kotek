import { Prisma, Product, ProductStatus } from "@prisma/client";
import prisma from "../lib/prisma";
import { NextRequest } from "next/server";
import { capitalizeFirstLetter } from "@/lib/utils";
import { GetAllProductsResponse, ProductValidationT } from "@/types/types";
import { productSchema, updateProductSchema } from "../lib/validation";
import { r2Client } from "./r2";

export async function getAllProducts(
  currentPage: number,
  pageSize: number,
  store: boolean | undefined
): Promise<GetAllProductsResponse> {
  // Ensure page and pageSize are valid numbers
  currentPage = Math.max(1, currentPage);
  pageSize = Math.max(1, pageSize);

  // Calculate the offset
  const skip = (currentPage - 1) * pageSize;
  const where = store
    ? {
        status: {
          not: "DRAFT" as ProductStatus, // Exclude products with status "DRAFT"
        },
      }
    : undefined;
  // Fetch products with pagination
  const products = await prisma.product.findMany({
    skip,
    take: pageSize,
    include: {
      category: true,
    },
    where,
    orderBy: [{ featured: "desc" }, { price: "asc" }], //order by takes an array for sorting by many criteria.
  });

  // Get total count of products for pagination calculations
  const total = await prisma.product.count();

  // Calculate pagination information
  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    products,
    pagination: {
      total,
      currentPage,
      pageSize,
      totalPages,
      hasPrevPage,
      hasNextPage,
    },
  };
}
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
  return product;
}

export async function createProduct(id: string, data: ProductValidationT) {
  try {
    const product = prisma.product.create({
      data: { id: id, ...data },
    });
    return product;
  } catch (error) {
    r2Client.deleteImages(data.imageUrls);
    throw error;
  }
}

export async function updateProduct(id: string, data: any) {
  const updatedProduct = await prisma.product.update({
    where: {
      id: id,
    },
    data: data,
  });
  return updatedProduct;
}

export async function deleteProduct(id: string) {
  // Fetch the product to get the name or any unique identifier for the directory
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (product)
    // delete product images from r2
    await r2Client.deleteImages(product.imageUrls);

  // Delete the product from the database
  const deletedProduct = await prisma.product.delete({
    where: { id },
  });
  return deletedProduct;
}

export async function productValidation(
  request: NextRequest,
  method: "POST" | "PUT",
  id: string
): Promise<ProductValidationT> {
  const formData = await request.formData();

  // Extract form data
  const extractedData = extractFormData(formData);

  // Process images
  const imageUrls = await processImages(formData, id);

  // Prepare data object
  const data = prepareProductData(extractedData, imageUrls);

  // Validate data with the appropriate schema based on request method
  if (method === "POST") {
    productSchema.parse(data as ProductValidationT);
  } else if (method === "PUT") {
    const existingProduct = await getProductById(id); // Fetch the existing product details by ID
    if (data.price && existingProduct && data.price >= existingProduct.price) {
      // Handle price comparison and update originalPrice accordingly
      data.originalPrice = data.price;
    } else if (
      data.price &&
      existingProduct &&
      data.price <= existingProduct.price
    ) {
      data.originalPrice = undefined;
    }
    updateProductSchema.parse(data as ProductValidationT);
  } else {
    console.error("Method not allowed.");
    throw new Error("Method not allowed.");
  }

  return data as ProductValidationT;
}

export async function processImages(formData: FormData, id: string) {
  const imagesToDelete: string[] = JSON.parse(
    formData.get("imagesToDelete")?.toString() || "[]"
  );

  let remainingUrls: string[] = JSON.parse(
    formData.get("imageUrls")?.toString() || "[]"
  );

  const files = formData.getAll("images[]") as File[];

  const prefix = `products/${id}`;
  const r2Urls = await r2Client.uploadImages(files, prefix);

  if (imagesToDelete.length > 0) {
    await r2Client.deleteImages(imagesToDelete);
  }

  return [...remainingUrls, ...r2Urls];
}

export function extractFormData(formData: FormData) {
  const name = formData.get("name")?.toString().trim() || "";
  const featured =
    formData.get("featured")?.toString().trim().toLowerCase() === "true";
  const description = formData.get("description")?.toString().trim() || "";
  const price = parseInt(formData.get("price")?.toString().trim() || "0", 10);
  const originalPrice = price;
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

  return {
    name,
    featured,
    description,
    price,
    originalPrice,
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
  };
}

export function prepareProductData(
  extractedData: ReturnType<typeof extractFormData>,
  imageUrls: string[]
): Partial<ProductValidationT> {
  const {
    name,
    description,
    price,
    originalPrice,
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
    featured,
  } = extractedData;
  return {
    ...(name && { name: capitalizeFirstLetter(name) }),
    ...(description && { description: capitalizeFirstLetter(description) }),
    ...(price && { price }),
    ...(originalPrice && { originalPrice }),
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
    ...{ featured },
  };
}
