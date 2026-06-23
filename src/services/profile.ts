import { apiClient } from "./client";
import { ProfileScreenData } from "../types";

export async function getProfile(): Promise<ProfileScreenData> {
    const { data } = await apiClient.get<ProfileScreenData>("/profile");
    return data;
}
