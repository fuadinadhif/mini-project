import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be 8 characters or more")
    .regex(/[a-z]/, "Password must contain at least one lowercase character")
    .regex(/[A-Z]/, "Password must contain at least one uppercase character")
    .regex(/[0-9]/, "Password must contain at least one digit character")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one symbol character"
    ),
  profilePic: z.url("Profile picture must be a valid url").optional(),
  referralCode: z.string().optional(),
});

export const tokenQuerySchema = z.object({
  token: z
    .string()
    .min(1, "Token is required")
    .length(64, "Invalid token format")
    .regex(/^[a-f0-9]+$/, "Token must be hexadecimal"),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type TokenQuerySchema = z.infer<typeof tokenQuerySchema>;
