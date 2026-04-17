import { createNativeBottomTabNavigator } from "@react-navigation/bottom-tabs/unstable";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { HomeScreen } from "../screens/HomeScreen";
import { WelcomeScreen } from "../screens/onboarding/WelcomeScreen";
import { useAuth } from "../contexts/AuthContext";
import { LoginScreen } from "../screens/onboarding/LoginScreen";
import { RegisterScreen } from "../screens/onboarding/RegisterScreen";

const Tab = createNativeBottomTabNavigator();
const Stack = createNativeStackNavigator();

export function AppRoutes() {
  const { session } = useAuth();

  return (
    <NavigationContainer>
      { session ? (
          <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} />
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