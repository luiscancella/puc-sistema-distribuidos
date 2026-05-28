import { z } from "zod";
import { CourseSchema } from "../courses/course.schema";
import { StudentSchema } from "../users/user.schema";
import { UniversitySchema } from "../university/university.schema";

export const GroupMemberSchema = z.object({
    student: StudentSchema,
    points: z.number().int(),
    isCurrentUser: z.boolean(),
});
export type GroupMember = z.infer<typeof GroupMemberSchema>;

export const GroupSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    university: UniversitySchema,
    memberCount: z.number().int(),
    memberLimit: z.number().int(),
    inviteCode: z.string(),
    weeklyCheckIns: z.number().int(),
    courses: z.array(CourseSchema),
    members: z.array(GroupMemberSchema),
});
export type Group = z.infer<typeof GroupSchema>;

export const CreateGroupSchema = z.object({
    universityId: z.uuid("Selecione uma faculdade"),
    name: z.string().min(2, "Nome do grupo deve ter pelo menos 2 caracteres"),
    courseIds: z.array(z.uuid()).min(1, "Adicione pelo menos uma matéria"),
});
export type CreateGroupData = z.infer<typeof CreateGroupSchema>;
