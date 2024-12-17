import * as z from "zod";
import { $Enums } from "@prisma/client";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  featured: z.boolean().default(false),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  images: z
    .array(z.union([z.string(), z.instanceof(File)]))
    .min(1, "At least one image is required"),
  stock: z.string().min(1, "Stock is required"),
  barcode: z.string().min(1, {
    message: "Please generate or input a barcode that's at least 5 characters.",
  }),
  categoryId: z.string().min(1, { message: "Please select a category." }),
  tags: z.string().optional(),
  keyFeatures: z.string().min(1, {
    message: "Key features are required if you want the store to look decent",
  }),
  brand: z.string().min(1, {
    message: "Please add a brand, if the product is brandless type N/A",
  }),
  status: z.string().min(1, { message: "Please select a status." }),
  length: z.number().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  weight: z.number().nullable(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
