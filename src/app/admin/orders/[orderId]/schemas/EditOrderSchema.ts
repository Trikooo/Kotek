import { OrderStatus } from "@prisma/client";
import * as z from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1, { message: "Product ID is required" }),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  price: z.number().min(0, { message: "Price must be a non-negative number" }),
  noestReady: z.boolean({
    required_error: "NoestReady status is required",
    invalid_type_error: "NoestReady must be a boolean",
  }),
  trackingId: z
    .string()
    .uuid("Invalid tracking ID format")
    .nullable()
    .optional(),
  tracking: z
    .object({
      trackingNumber: z
        .string()
        .min(1, { message: "Tracking number is required" }),
      trackingStatus: z.nativeEnum(OrderStatus, {
        errorMap: (issue, ctx) => ({ message: "Invalid order status" }),
      }),
    })
    .optional()
    .nullable(),
  product: z.object({
    name: z.string().min(1, { message: "Product name is required" }),
    imageUrls: z
      .array(z.string().url({ message: "Invalid image URL" }))
      .min(1, { message: "At least one image URL is required" }),
    weight: z
      .number()
      .min(0, { message: "Weight must be a non-negative number" }),
  }),
});

export const orderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, { message: "At least one item is required in the order" }),
  subtotalAmount: z
    .number()
    .min(0, { message: "Subtotal amount must be a non-negative number" }),
  shippingPrice: z
    .number()
    .min(0, { message: "Shipping price must be a non-negative number" }),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
