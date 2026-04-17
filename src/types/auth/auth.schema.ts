import z from "zod";
import { UserSchema } from "../users/user.schema";

export const SignInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const SignUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const AuthSessionSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

export type SignInData = z.infer<typeof SignInSchema>;
export type SignUpData = z.infer<typeof SignUpSchema>;
export type AuthSession = z.infer<typeof AuthSessionSchema>;