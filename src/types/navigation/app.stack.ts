import type { NavigatorScreenParams } from "@react-navigation/native";

import type { CheckInStackParamList } from "./check-in.stack";

export type AppStackParamList = {
    Main: undefined;
    CheckIn: NavigatorScreenParams<CheckInStackParamList>;
};
