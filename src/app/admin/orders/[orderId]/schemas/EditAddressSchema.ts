import * as z from "zod";

export const addressSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    phoneNumber: z
      .string()
      .regex(/^(0|\+213)[2-7][0-9]{8}$/, "Invalid phone number"),
    secondPhoneNumber: z
      .string()
      .regex(/^(0|\+213)[2-7][0-9]{8}$/, "Invalid phone number")
      .optional()
      .or(z.literal("")),
    wilayaValue: z.string().min(1, "Please select a wilaya"),
    wilayaLabel: z.string().min(1, "Please select a wilaya"),
    commune: z.string().min(1, "Please select a commune"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    stopDesk: z.boolean(),
    stationCode: z.string().nullable(),
    stationName: z.string().nullable(),
  })
  .refine(
    (data) => {
      if (data.stopDesk) {
        return !!(data.stationCode && data.stationName);
      }
      return true;
    },
    {
      message: "Station is required when using stop desk delivery",
      path: ["stationCode"],
    }
  );

export type AddressFormValues = z.infer<typeof addressSchema>;
