// validators/register.ts
import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  email: z.string().email("Email tidak valid").optional(),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type RegisterValues = z.infer<typeof registerSchema>;
