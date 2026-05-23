import { z } from "zod";

export const StudentSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.email(),
    groupId: z.uuid().optional(),
});

export type Student = z.infer<typeof StudentSchema>;
