import { z } from "zod";

export const credentials = z.object({
  email: z.email(),
  password: z.string().min(8).max(72),
});
