import { z } from "zod";

export const CheckInPhotoSchema = z.object({
    id: z.uuid(),
    classId: z.uuid(),
    studentId: z.uuid(),
    photoUri: z.string(),
    submittedAt: z.iso.datetime({ offset: true }),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export type CheckInPhoto = z.infer<typeof CheckInPhotoSchema>;
