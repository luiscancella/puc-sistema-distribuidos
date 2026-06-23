import { apiClient } from "./client";
import { CreateGroupData, Group } from "../types";

export async function getGroup(groupId: string): Promise<Group> {
    const { data } = await apiClient.get<Group>(`/groups/${groupId}`);
    return data;
}

export async function createGroup(body: CreateGroupData): Promise<{ groupId: string }> {
    const { data } = await apiClient.post<{ groupId: string }>("/groups", body);
    return data;
}

export async function joinGroup(inviteCode: string): Promise<{ groupId: string }> {
    const { data } = await apiClient.post<{ groupId: string }>("/groups/join", { inviteCode });
    return data;
}
