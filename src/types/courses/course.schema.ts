import { z } from "zod";

export const CourseScheduleSchema = z.object({
    id: z.uuid(),
    day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
    startsAt: z.iso.time(),
    endsAt: z.iso.time().optional(),
});

export type CourseSchedule = z.infer<typeof CourseScheduleSchema>;

export const CourseSchema = z.object({
    id: z.uuid(),
    shortLabel: z.string(),
    name: z.string(),
    teacher: z.string(),
    location: z.string(),
    schedules: z.array(CourseScheduleSchema),
});

export type Course = z.infer<typeof CourseSchema>;