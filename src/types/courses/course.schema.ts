import { z } from "zod";

export const CourseSchema = z.object({
    id: z.uuid(),
    shortLabel: z.string(),
    name: z.string(),
    teacher: z.string(),
    location: z.string(),
    startsAt: z.string(),
    endsAt: z.string(),
});

export type Course = z.infer<typeof CourseSchema>;