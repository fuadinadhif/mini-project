import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profilePic: z.string().url("Must be a valid URL").optional(),
  referralCode: z.string().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
