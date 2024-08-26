import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(20, "Name must not exceed 20 characters."),
  description: z.string().optional(),
  parentId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string()
})