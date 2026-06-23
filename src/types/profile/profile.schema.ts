import { z } from "zod";
import { StudentSchema } from "../users/user.schema";

export const StudentStatsSchema = z.object({
    checkIns:      z.number().int(),
    currentStreak: z.number().int(),
    bestStreak:    z.number().int(),
    points:        z.number().int(),
    rank:          z.number().int(),
});
export type StudentStats = z.infer<typeof StudentStatsSchema>;

export const ProfileScreenDataSchema = z.object({
    student:        StudentSchema,
    universityName: z.string().nullable(),
    stats:          StudentStatsSchema,
});
export type ProfileScreenData = z.infer<typeof ProfileScreenDataSchema>;
