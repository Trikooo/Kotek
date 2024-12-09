import * as z from "zod";

export const shippingFormSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Full name must be at least 2 characters.",
    }),
    phoneNumber: z.string().min(10, {
      message: "Phone number must be at least 10 digits.",
    }),
    secondPhoneNumber: z.string().optional(),
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
    station: z.object({
      value: z.string(),
      label: z.string(),
    }).optional(),
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
      path: ["station"], // This will show the error on the stationCode field
    }
  );

export type ShippingFormValues = z.infer<typeof shippingFormSchema>;
