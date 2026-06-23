import { apiClient } from "./client";
import { Course, University } from "../types";

export async function listUniversities(): Promise<University[]> {
    const { data } = await apiClient.get<University[]>("/universities");
    return data;
}

export async function listCourses(universityId: string): Promise<Course[]> {
    const { data } = await apiClient.get<Course[]>(`/universities/${universityId}/courses`);
    return data;
}
