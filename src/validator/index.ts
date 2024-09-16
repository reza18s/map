import { z } from "zod";

export const pointObject = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  lat: z.number(),
  lng: z.number(),
  frequency: z.number(),
});
