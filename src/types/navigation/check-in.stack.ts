export type CheckInStackParamList = {
    Camera: undefined;
    Confirm: { photoUri: string; courseName: string; classSessionId: string; latitude: number; longitude: number };
    Success: { pointsEarned: number; streakCount: number };
};
