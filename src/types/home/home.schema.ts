import { z } from "zod";

import { GroupSchema } from "../groups/group.schema";

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

export const HomeScreenDataSchema = z.object({
    streak: StreakDataSchema,
    checkIn: CheckInStatusSchema,
    group: GroupSchema,
});
export type HomeScreenData = z.infer<typeof HomeScreenDataSchema>;
