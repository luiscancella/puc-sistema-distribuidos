import { z } from "zod";

import { GroupMemberSchema } from "../groups/group.schema";
import { CourseSchema } from "../courses/course.schema";

export const StreakDataSchema = z.object({
    currentStreak: z.number().int().positive(),
    targetStreak: z.number().int().positive(),
    deadlineLabel: z.iso.datetime(),
});
export type StreakData = z.infer<typeof StreakDataSchema>;

export const CheckInStatusSchema = z.object({
    checkedInToday: z.boolean(),
    pointReward: z.number().int(),
    dateLabel: z.iso.date(),
});
export type CheckInStatus = z.infer<typeof CheckInStatusSchema>;

export const HomeGroupSchema = z.object({
    members: z.array(GroupMemberSchema),
    courses: z.array(CourseSchema),
});
export type HomeGroup = z.infer<typeof HomeGroupSchema>;

export const HomeScreenDataSchema = z.object({
    streak: StreakDataSchema,
    checkIn: CheckInStatusSchema,
    group: HomeGroupSchema.nullable(),
});
export type HomeScreenData = z.infer<typeof HomeScreenDataSchema>;
