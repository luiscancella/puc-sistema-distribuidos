import { z } from "zod";

import { StudentSchema } from "../users/user.schema";

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

export const SquadRankingEntrySchema = z.object({
    rank: z.number().int().positive(),
    student: StudentSchema,
    points: z.number().int(),
    isCurrentUser: z.boolean(),
});
export type SquadRankingEntry = z.infer<typeof SquadRankingEntrySchema>;

export const HomeScreenDataSchema = z.object({
    streak: StreakDataSchema,
    checkIn: CheckInStatusSchema,
    squadRanking: z.array(SquadRankingEntrySchema).max(3),
});
export type HomeScreenData = z.infer<typeof HomeScreenDataSchema>;
