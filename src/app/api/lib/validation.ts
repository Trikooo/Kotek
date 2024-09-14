import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(20, "Name must not exceed 20 characters."),
  description: z.string().optional(),
  parentId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string(),
  subcategories: z.array(z.string().uuid(), { required_error: "Subcategories must be an array of UUIDs" }).optional(), // Ensure subcategories is an array of UUIDs

})