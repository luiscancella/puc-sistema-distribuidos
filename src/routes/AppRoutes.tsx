import { NavigationContainer } from "@react-navigation/native";
import { useFonts, BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";
import { HankenGrotesk_500Medium, HankenGrotesk_800ExtraBold } from "@expo-google-fonts/hanken-grotesk";

import { useAuth } from "../contexts/AuthContext";
import OnboardingNavigator from "./OnboardingNavigator";
import GroupSetupNavigator from "./GroupSetupNavigator";
import MainNavigator from "./MainNavigator";

export function AppRoutes() {
  const { session } = useAuth();
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
    HankenGrotesk_500Medium,
    HankenGrotesk_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      {session === null ? (
        <OnboardingNavigator />
      ) : session.student.groupId ? (
        <MainNavigator />
      ) : (
        <GroupSetupNavigator />
      )}
    </NavigationContainer>
  );
}