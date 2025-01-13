import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z
    .custom<File>()
    .refine((file) => file instanceof File, "Image is required"),
  tags: z.string(),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

// ... (keep existing CreateCategoryFormData and createCategorySchema)

export const editCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.instanceof(File).optional(),
  tags: z.string(),
});

export type EditCategoryFormData = z.infer<typeof editCategorySchema>;

export const createSubcategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z
    .custom<File>()
    .refine((file) => file instanceof File, "Image is required"),
  tags: z.string(),
  parentId: z.string(),
});

export type CreateSubcategoryFormData = z.infer<typeof createSubcategorySchema>;
