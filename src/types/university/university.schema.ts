import { z } from "zod";

export const UniversitySchema = z.object({
    id: z.uuid(),
    name: z.string(),
    shortLabel: z.string().optional(),
});

export type University = z.infer<typeof UniversitySchema>;
