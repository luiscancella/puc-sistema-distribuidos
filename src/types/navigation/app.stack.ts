import type { NavigatorScreenParams } from "@react-navigation/native";

import type { CheckInStackParamList } from "./check-in.stack";

export type MainTabsParamList = {
    Home: undefined;
    Schedule: undefined;
    Groups: undefined;
    Me: undefined;
};

export type AppStackParamList = {
    Main: NavigatorScreenParams<MainTabsParamList> | undefined;
    CheckIn: NavigatorScreenParams<CheckInStackParamList> | undefined;
};
