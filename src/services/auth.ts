import { apiClient } from "./client";
import { AuthSession, SignInData, SignUpData } from "../types";

export async function signIn(data: SignInData): Promise<AuthSession> {
    const { data: response } = await apiClient.post<AuthSession>("/auth/sign-in", data);
    return response;
}

export async function signUp(data: SignUpData): Promise<AuthSession> {
    const { confirmPassword, ...requestData } = data;
    const { data: response } = await apiClient.post<AuthSession>("/auth/sign-up", requestData);
    return response;
}
