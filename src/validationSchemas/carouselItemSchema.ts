import { isValidUrl } from "@/utils/generalUtils";
import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/*"]; // Accept all image types

export const carouselItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z.string().refine((val) => isValidUrl(val), "Must be a valid URL"),
  imageFile: z
    .custom<FileList>(
      (val) => val instanceof FileList,
      "Please upload an image"
    )
    .refine((files) => files.length > 0, "Image is required")
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      "Max image size is 1MB, Please visit imagecompressor.11zon.com to compress your image."
    ),
});

export type CarouselItemFormValues = z.infer<typeof carouselItemSchema>;

export const updateCarouselItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z.string().refine((val) => isValidUrl(val), "Must be a valid URL"),
  enabled: z.boolean().default(true),
  imageFile: z
    .custom<FileList>(
      (val) => val instanceof FileList,
      "Please upload an image"
    )
    .refine((files) => files.length > 0, "Image is required")
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      "Max image size is 1MB, Please visit imagecompressor.11zon.com to compress your image."
    ),
});

export type UpdateCarouselItemFormValues = z.infer<
  typeof updateCarouselItemSchema
>;
