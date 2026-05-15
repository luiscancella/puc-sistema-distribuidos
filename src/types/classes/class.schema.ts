import { z } from "zod";
import { CourseSchema } from "../courses/course.schema";

export const AttendanceRecordSchema = z.object({
    id: z.uuid(),
    studentId: z.string(),
    sessionId: z.string(),
    isPresent: z.enum(["present", "absent"]).optional(),
    timestamp: z.string(),  
});

export const ClassSessionSchema = z.object({
    id: z.uuid(),
    course: CourseSchema,
    attendance: z.array(AttendanceRecordSchema),
    realizedAt: z.string(),
});
export type ClassSession = z.infer<typeof ClassSessionSchema>;