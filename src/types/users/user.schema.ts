import { z } from "zod";
import { UniversitySchema } from "../university/university.schema";
import { CourseSchema } from "../courses/course.schema";

export const StudentSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.email(),
    university: UniversitySchema,
    courses: z.array(CourseSchema),
});

export type Student = z.infer<typeof StudentSchema>;
