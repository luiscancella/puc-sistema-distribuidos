import { apiClient } from "./client";

export type CurrentClassSession = {
    id: string;
    course: { id: string; name: string; shortLabel: string; location: string };
    date: string;
};

export async function getCurrentClass(): Promise<CurrentClassSession | null> {
    const { data } = await apiClient.get<{ classSession: CurrentClassSession | null }>(
        "/check-ins/current-class"
    );
    return data.classSession;
}

export type SubmitCheckInParams = {
    classSessionId: string;
    photoUri: string;
    latitude: number;
    longitude: number;
};

export type CheckInResult = {
    checkInPhotoId: string;
    pointsEarned: number;
    streakCount: number;
};

export class TooFarError extends Error {
    distanceMeters: number;
    constructor(distanceMeters: number) {
        super("TOO_FAR");
        this.distanceMeters = distanceMeters;
    }
}

function buildCheckInForm(params: SubmitCheckInParams) {
    const form = new FormData();
    form.append("classSessionId", params.classSessionId);
    form.append("latitude", String(params.latitude));
    form.append("longitude", String(params.longitude));
    form.append("photo", {
        uri: params.photoUri,
        name: "checkin.jpg",
        type: "image/jpeg",
    } as unknown as Blob);
    return form;
}

async function postCheckIn(params: SubmitCheckInParams): Promise<CheckInResult> {
    try {
        const { data } = await apiClient.post<CheckInResult>("/check-ins", buildCheckInForm(params), {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    } catch (err: any) {
        const detail = err?.response?.data?.detail;
        if (err?.response?.status === 422 && detail?.error === "TOO_FAR") {
            throw new TooFarError(detail.distanceMeters);
        }
        if (err?.response?.status === 409) {
            throw new Error("ALREADY_CHECKED_IN");
        }
        throw err;
    }
}

export async function submitCheckIn(params: SubmitCheckInParams): Promise<CheckInResult> {
    try {
        return await postCheckIn(params);
    } catch (err: any) {
        if (err?.code === "ERR_NETWORK") {
            return await postCheckIn(params);
        }
        throw err;
    }
}
