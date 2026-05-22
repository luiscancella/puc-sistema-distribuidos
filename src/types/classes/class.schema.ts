import { z } from "zod";
import { CourseScheduleSchema, CourseSchema } from "../courses/course.schema";

export const AttendanceRecordSchema = z.object({
    id: z.uuid(),
    studentId: z.uuid(),
    sessionId: z.uuid(),
    status: z.enum(["PRESENT", "ABSENT", "LATE"]).optional(),
    markedAt: z.iso.datetime({ offset: true }),
});

export type AttendanceRecord = z.infer<typeof AttendanceRecordSchema>;

export const ClassSessionSchema = z.object({
    id: z.uuid(),
    course: CourseSchema,
    schedule: CourseScheduleSchema,
    attendance: z.array(AttendanceRecordSchema).optional(),
    date: z.iso.date(),
});

export type ClassSession = z.infer<typeof ClassSessionSchema>;