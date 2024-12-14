import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(20, "Name must not exceed 20 characters."),
  description: z.string().optional(),
  parentId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string(),
  subcategories: z
    .array(z.string().uuid(), {
      required_error: "Subcategories must be an array of UUIDs",
    })
    .optional(), // Ensure subcategories is an array of UUIDs
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(20, "Name must not exceed 20 characters."),
  description: z.string().optional(),
  parentId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  subcategories: z
    .array(z.string().uuid(), {
      required_error: "Subcategories must be an array of UUIDs",
    })
    .optional(), // Ensure subcategories is an array of UUIDs
});

// Define the Product schema
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"), // Ensure name is not empty
  description: z.string().optional(),
  price: z.number().int().positive("Price must be a positive integer"), // Positive integer for price
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"), // Non-negative integer for stock
  barcode: z.string().min(1, "barcode is required"), // Optional barcode as a UUID or null
  categoryId: z.string().uuid().nullable().optional(), // Optional categoryId as a UUID or null
  tags: z.array(z.string()), // Array of non-empty strings
  keyFeatures: z.array(z.string()),
  brand: z.string().optional(), // Optional brand
  status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]), // Enum for product status
  length: z.number().nonnegative().optional(), // Optional non-negative number for length
  width: z.number().nonnegative().optional(), // Optional non-negative number for width
  height: z.number().nonnegative().optional(), // Optional non-negative number for height
  weight: z.number().nonnegative().optional(), // Optional non-negative number for weight
  imageUrls: z.array(z.string()).nonempty(),
});

// Type inference for TypeScript
export type ProductSchemaType = z.infer<typeof productSchema>;

export const updateProductSchema = z.object({
  name: z.string().min(1, "Name is required"), // Ensure name is not empty
  description: z.string().optional(), // Ensure description is not empty
  price: z.number().int().positive("Price must be a positive integer"), // Positive integer for price
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"), // Non-negative integer for stock
  barcode: z.string().min(1, "barcode is required"), // Optional barcode as a UUID or null
  categoryId: z.string().uuid().nullable().optional(), // Optional categoryId as a UUID or null
  tags: z.array(z.string()), // Array of non-empty strings
  keyFeatures: z.array(z.string()),
  brand: z.string().optional(), // Optional brand
  status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]), // Enum for product status
  length: z.number().nonnegative().optional(), // Optional non-negative number for length
  width: z.number().nonnegative().optional(), // Optional non-negative number for width
  height: z.number().nonnegative().optional(), // Optional non-negative number for height
  weight: z.number().nonnegative().optional(), // Optional non-negative number for weight
  imageUrls: z.array(z.string()).nonempty(),
});

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  price: z.number().int().nonnegative(),
});

export const cartUpdateRequestSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(cartItemSchema).max(100),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CartUpdateRequest = z.infer<typeof cartUpdateRequestSchema>;

export const AddressSchema = z.object({
  id: z.string().optional(),
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  phoneNumber: z.string().regex(/^0\d{9}$/, {
    message: "Phone number must be 10 digits starting with 0",
  }),
  secondPhoneNumber: z
    .string()
    .regex(/^0\d{9}$/, {
      message: "Second phone number must be 10 digits starting with 0",
    })
    .nullable()
    .optional(),
  wilayaValue: z.string().min(1, { message: "Wilaya value is required" }),
  wilayaLabel: z.string().min(1, { message: "Wilaya label is required" }),
  commune: z.string().min(1, { message: "Commune is required" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  shippingPrice: z
    .number()
    .min(0, { message: "Shipping price must be a non-negative number" }),
  stopDesk: z.boolean(),
  stationCode: z.string().nullable().optional(),
  stationName: z.string().nullable().optional(),
});
export type AddressType = z.infer<typeof AddressSchema>;

// Enum for Order Status
export const OrderStatusEnum = z.enum([
  "PENDING",
  "PROCESSING",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
]);

export const KotekOrderItemSchema = z.object({
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  price: z.number().nonnegative("Price must be a non-negative number"),
  productId: z.string().min(1, "Product ID is required"),
});

export const KotekOrderSchema = z.object({
  status: OrderStatusEnum,
  totalAmount: z
    .number()
    .nonnegative("Total amount must be a non-negative number"),
  subtotalAmount: z
    .number()
    .nonnegative("Subtotal amount must be a non-negative number"),
  userId: z.string().optional(),
  addressId: z.string().optional(),
  guestAddress: AddressSchema.optional(),
  items: z
    .array(KotekOrderItemSchema)
    .nonempty("Order must have at least one item"),
});

// Note: Make sure to import or define AddressSchema separately
export type KotekOrder = z.infer<typeof KotekOrderSchema>;

import { ProductStatus } from "@prisma/client";

export const ProductSearchParamsSchema = z
  .object({
    query: z.string().trim().max(100).optional(),
    categoryIds: z
      .array(z.string().uuid("Invalid category ID"))
      .max(10, "Too many category IDs")
      .optional(),
    minPrice: z
      .number()
      .int()
      .positive("Price must be positive")
      .max(1000000, "Price is too high")
      .optional(),
    maxPrice: z
      .number()
      .int()
      .positive("Price must be positive")
      .max(1000000, "Price is too high")
      .optional(),
    brands: z
      .array(z.string().trim().max(50))
      .max(10, "Too many brands")
      .optional(),
    statuses: z
      .array(z.enum(["ACTIVE", "INACTIVE", "DRAFT"]))
      .max(3, "Too many statuses")
      .optional(),
    tags: z
      .array(z.string().trim().max(50))
      .max(20, "Too many tags")
      .optional(),
    pageSize: z
      .number()
      .int()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .default(10),
    currentPage: z
      .number()
      .int()
      .min(1, "Page should be greater than 1")
      .default(1),
  })
  .refine(
    (data) => {
      // Optional: Add custom validation for price range
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    { message: "Minimum price must be less than or equal to maximum price" }
  );
