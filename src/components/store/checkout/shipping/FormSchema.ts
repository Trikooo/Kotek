import * as z from "zod";

const phoneRegex = /^[0-9]+$/;

export const shippingFormSchema = z
  .object({
    fullName: z.string().min(4, {
      message: "Full name must be at least 4 characters.",
    }),
    phoneNumber: z
      .string()
      .min(10, {
        message: "Phone number must be at exactly 10 digits.",
      })
      .max(10, { message: "Phone number must be exactly 10 digits" })
      .refine((value) => phoneRegex.test(value), {
        message: "Please enter a valid phone number.",
      }),
    secondPhoneNumber: z
      .string()
      .optional()
      .refine((value) => !value || phoneRegex.test(value), {
        message: "Please enter a valid phone number, or leave it blank.",
      }),
    address: z.string().min(5, {
      message: "Address must be at least 5 characters.",
    }),
    wilaya: z.object({
      value: z.string(),
      label: z.string(),
    }),
    commune: z.object({
      value: z.string(),
      label: z.string(),
    }),
    stopDesk: z.boolean().default(false),
    station: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.stopDesk) {
        return !!data.station;
      }
      return true;
    },
    {
      message: "Station is required when using stop desk delivery",
      path: ["station"],
    }
  );

export type ShippingFormValues = z.infer<typeof shippingFormSchema>;
