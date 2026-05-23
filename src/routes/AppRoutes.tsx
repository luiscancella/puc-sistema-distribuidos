import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts, BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";
import { HankenGrotesk_500Medium, HankenGrotesk_800ExtraBold } from "@expo-google-fonts/hanken-grotesk";

import { useAuth } from "../contexts/AuthContext";
import HomeScreen from "../screens/HomeScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import LoginScreen from "../screens/onboarding/LoginScreen";
import RegisterScreen from "../screens/onboarding/RegisterScreen";
import WelcomeScreen from "../screens/onboarding/WelcomeScreen";
import GroupChoiceScreen from "../screens/group-setup/GroupChoiceScreen";
import CreateGroupScreen from "../screens/group-setup/CreateGroupScreen";
import JoinGroupScreen from "../screens/group-setup/JoinGroupScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const GroupSetupStack = createNativeStackNavigator();

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
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      ) : session.student.groupId ? (
        <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => ( <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} /> ),
            }}
          />
          <Tab.Screen name="Schedule" component={ScheduleScreen} />
        </Tab.Navigator>
      ) : (
        <GroupSetupStack.Navigator initialRouteName="GroupChoice" screenOptions={{ headerShown: false }}>
          <GroupSetupStack.Screen name="GroupChoice" component={GroupChoiceScreen} />
          <GroupSetupStack.Screen name="CreateGroup" component={CreateGroupScreen} />
          <GroupSetupStack.Screen name="JoinGroup" component={JoinGroupScreen} />
        </GroupSetupStack.Navigator>
      )}
    </NavigationContainer>
  );
}