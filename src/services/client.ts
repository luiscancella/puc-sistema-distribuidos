import axios from "axios";
import crashlytics from "@react-native-firebase/crashlytics";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
});

export function setAuthToken(token: string | null) {
    if (token) {
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common.Authorization;
    }
}

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
    onUnauthorized = handler;
}

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            onUnauthorized?.();
        } else {
            crashlytics().log(`HTTP ${error.response?.status ?? "network"}: ${error.config?.url}`);
        }
        return Promise.reject(error);
    }
);
