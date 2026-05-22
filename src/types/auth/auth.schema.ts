import z from "zod";
import { UserSchema } from "../users/user.schema";

export const SignInSchema = z.object({
  email: z.email("Digite um e-mail váilido"),
  password: z.string().min(1, "Senha é obrigatória").min(6, "Senha deve conter no mínimo 6 caracteres"),
});
export type SignInData = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.email("Digite um e-mail válido"),
  university: z.string().min(2, "Universidade é obrigatória"),
  course: z.string().min(2, "Curso é obrigatório"),
  password: z.string().min(6, "Senha deve conter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});
export type SignUpData = z.infer<typeof SignUpSchema>;

export const AuthSessionSchema = z.object({
  token: z.string(),
  user: UserSchema,
});
export type AuthSession = z.infer<typeof AuthSessionSchema>;