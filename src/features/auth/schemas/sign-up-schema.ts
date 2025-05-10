import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters",
    })
    .max(50, { message: "Username must be less than 50 characters" })
    .trim()
    .refine((val) => /^[a-zA-Z0-9_]+$/.test(val), {
      message: "Username can only contain letters, numbers and underscores",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

export type SignupSchemaType = z.infer<typeof signupSchema>;
