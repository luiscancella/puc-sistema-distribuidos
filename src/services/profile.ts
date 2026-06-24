import { apiClient } from "./client";
import { ProfileScreenData } from "../types";

export async function getProfile(): Promise<ProfileScreenData> {
    const { data } = await apiClient.get<ProfileScreenData>("/profile");
    return data;
}

export async function registerPushToken(token: string): Promise<void> {
    await apiClient.post("/profile/push-token", { pushToken: token });
}
