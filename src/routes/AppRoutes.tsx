import { createNativeBottomTabNavigator } from "@react-navigation/bottom-tabs/unstable";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../contexts/AuthContext";
import HomeScreen from "../screens/HomeScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import LoginScreen from "../screens/onboarding/LoginScreen";
import RegisterScreen from "../screens/onboarding/RegisterScreen";
import WelcomeScreen from "../screens/onboarding/WelcomeScreen";

const Tab = createNativeBottomTabNavigator();
const Stack = createNativeStackNavigator();

export function AppRoutes() {
  const { session } = useAuth();

  return (
    <NavigationContainer>
      { session !== null ? (
          <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Schedule" component={ScheduleScreen} />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        )
      }
    </NavigationContainer>
  );
}