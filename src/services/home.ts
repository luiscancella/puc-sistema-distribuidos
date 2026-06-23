import { apiClient } from "./client";
import { HomeScreenData, Student } from "../types";

type HomeMemberResponse = { student: Student; points: number };
type HomeResponse = {
    streak: HomeScreenData["streak"];
    checkIn: HomeScreenData["checkIn"];
    group: { members: HomeMemberResponse[] } | null;
};

export async function getHome(currentStudentId: string): Promise<HomeScreenData> {
    const { data } = await apiClient.get<HomeResponse>("/home");
    return {
        ...data,
        group: data.group && {
            members: data.group.members.map((m) => ({
                ...m,
                isCurrentUser: m.student.id === currentStudentId,
            })),
        },
    };
}
