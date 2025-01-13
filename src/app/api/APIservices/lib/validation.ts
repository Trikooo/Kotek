import { isValidUrl } from "@/utils/generalUtils";
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
  featured: z.boolean(),
  description: z.string().optional(),
  price: z.number().int().positive("Price must be a positive integer"), // Positive integer for price
  originalPrice: z
    .number()
    .int()
    .positive("Original price must be a positive integer"),
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
});

// Type inference for TypeScript
export type ProductSchemaType = z.infer<typeof productSchema>;

export const updateProductSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    featured: z.boolean(),
    description: z.string().optional(),
    price: z.number().int().positive("Price must be a positive integer"),
    stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
    barcode: z.string().min(1, "barcode is required"),
    categoryId: z.string().uuid().nullable().optional(),
    tags: z.array(z.string()),
    keyFeatures: z.array(z.string()),
    brand: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]),
    length: z.number().nonnegative().optional(),
    width: z.number().nonnegative().optional(),
    height: z.number().nonnegative().optional(),
    weight: z.number().nonnegative().optional(),
    imageUrls: z.array(z.string()).nonempty(),
    originalPrice: z.number().optional(), // Allow originalPrice to be optional
  })
  .refine(
    (data) => {
      if (data.originalPrice !== undefined) {
        return data.originalPrice >= data.price;
      }
      return true; // If originalPrice is not provided, no check
    },
    {
      message: "originalPrice must be greater than or equal to price",
      path: ["originalPrice"],
    }
  );

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
  baseShippingPrice: z
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
  id: z.string().uuid().optional(),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  price: z.number().nonnegative("Price must be a non-negative number"),
  productId: z.string().min(1, "Product ID is required"),
  noestReady: z.boolean().default(false),
  trackingId: z.string().uuid().optional().nullable(),
});

export const KotekOrderSchema = z.object({
  id: z.string().uuid().optional(),
  status: OrderStatusEnum,
  totalAmount: z
    .number()
    .nonnegative("Total amount must be a non-negative number"),
  subtotalAmount: z
    .number()
    .nonnegative("Subtotal amount must be a non-negative number"),
  shippingPrice: z
    .number()
    .min(0, { message: "Shipping price must be a non-negative number" }),
  userId: z.string().nullable().optional(),
  addressId: z.string().nullable().optional(),
  guestAddress: AddressSchema.optional().nullable(),
  items: z
    .array(KotekOrderItemSchema)
    .nonempty("Order must have at least one item"),
});

export type KotekOrder = z.infer<typeof KotekOrderSchema>;

export const ProductSearchParamsSchema = z
  .object({
    query: z.string().trim().max(100).optional(),
    categoryIds: z.array(z.string().uuid("Invalid category ID")).optional(),
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
    sort: z.enum(["featured", "price-asc", "price-desc", "newest"]).optional(),
    store: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    { message: "Minimum price must be less than or equal to maximum price" }
  );

export const CreateNoestOrderSchema = z
  .object({
    reference: z.string().max(255).nullable(),
    client: z.string().min(1).max(255),
    phone: z
      .string()
      .regex(/^(0|\+213)[2-7][0-9]{8}$/, "Invalid phone number")
      .nullable(),
    phone_2: z
      .string()
      .regex(/^(0|\+213)[2-7][0-9]{8}$/, "Invalid phone number")
      .optional()
      .nullable(),
    adresse: z.string().min(1).max(255),
    wilaya_id: z.number().int().min(1).max(48),
    commune: z.string().min(1).max(255),
    montant: z.number(),
    remarque: z.string().max(255).optional(),
    produit: z.string().min(1),
    type_id: z.number().int().min(1).max(3),
    poids: z.number().int(),
    stop_desk: z.number().int().min(0).max(1),
    station_code: z.string().optional().nullable(),
    stock: z.number().int().min(0).max(1),
    quantite: z.string().optional().nullable(),
    can_open: z.number().int().min(0).max(1).optional(),
  })
  .refine((data) => {
    if (data.stop_desk === 1 && !data.station_code) {
      throw new Error("Station code is required for stop desk delivery");
    }
    if (data.stock === 1 && !data.quantite) {
      throw new Error("Quantity is required when stock is selected");
    }
    return true;
  });
type CreateNoestOrderSchema = z.infer<typeof CreateNoestOrderSchema>;

export const UpdateNoestOrderSchema = z
  .object({
    reference: z.string().max(255).nullable().optional(),
    tracking: z.string(), // Required field
    client: z.string().min(1).max(255).optional(),
    phone: z
      .string()
      .regex(/^\d{9,10}$/)
      .optional(),
    phone_2: z
      .string()
      .regex(/^\d{9,10}$/)
      .optional(),
    adresse: z.string().min(1).max(255).optional(),
    wilaya_id: z.number().int().min(1).max(48).optional(),
    commune: z.string().min(1).max(255).optional(),
    montant: z.number().optional(),
    remarque: z.string().max(255).optional(),
    produit: z.string().min(1).optional(),
    type_id: z.number().int().min(1).max(3).optional(),
    poids: z.number().int().optional(),
    stop_desk: z.number().int().min(0).max(1).optional(),
    station_code: z.string().optional(),
    stock: z.number().int().min(0).max(1).optional(),
    quantite: z.string().optional(),
    can_open: z.number().int().min(0).max(1).optional(),
  })
  .refine((data) => {
    if (data.stop_desk === 1 && !data.station_code) {
      throw new Error("Station code is required for stop desk delivery");
    }
    if (data.stock === 1 && !data.quantite) {
      throw new Error("Quantity is required when stock is selected");
    }
    return true;
  });

type UpdateNoestOrderSchema = z.infer<typeof UpdateNoestOrderSchema>;

export const feedbackSchema = z.object({
  sentiment: z.enum(["negative", "neutral", "positive"], {
    description:
      "Sentiment must be one of 'negative', 'neutral', or 'positive'.",
  }),
  message: z.string(),
});

// File validation schema
const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "File size must be 5MB or less",
  })
  .refine((file) => file.type.startsWith("image/"), {
    message: "File must be an image",
  });

export const updateCarouselItemSchema = z.object({
  image: fileSchema.optional(),
  link: z
    .string()
    .refine((val) => isValidUrl(val), "Must be a valid URL")
    .optional(),
  title: z.string().optional(),
  displayIndex: z.number().int().min(0),
  isActive: z.boolean().default(true), // isActive should be a boolean, defaulting to true
  imageUrl: z.string().url(),
});

export const createCarouselItemSchema = z.object({
  image: fileSchema,
  link: z.string().refine((val) => isValidUrl(val), "Must be a valid URL"),
  title: z.string(),
  isActive: z.boolean().default(true),
});
