import { z } from "zod";

export const pointObject = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  lat: z.number(),
  lng: z.number(),
  frequency: z.number(),
  iconType: z.string(),
  active: z.boolean(),
  status: z.boolean(),
  connect: z.boolean(),
  level: z.number(),
});
export const settingsObject = z.object({
  lat_settings: z.number().min(-90).max(90), // Validation for lat
  lng_settings: z.number().min(-180).max(180), // Validation for lng
  zoom: z
    .number()
    .min(0, { message: "Zoom must be at least 0" })
    .max(22, { message: "Zoom must be at most 22" }), // Validation for zoom
  file: z.instanceof(FileList).optional(),
});
