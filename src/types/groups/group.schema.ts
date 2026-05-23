import { z } from "zod";
import { CourseSchema } from "../courses/course.schema";

export const GroupSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    courses: z.array(CourseSchema),
});
export type Group = z.infer<typeof GroupSchema>;

export const CreateGroupSchema = z.object({
    universityId: z.uuid("Selecione uma faculdade"),
    name: z.string().min(2, "Nome do grupo deve ter pelo menos 2 caracteres"),
    courseIds: z.array(z.uuid()).min(1, "Adicione pelo menos uma matéria"),
});
export type CreateGroupData = z.infer<typeof CreateGroupSchema>;
