import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GroupChoiceScreen from "../screens/group-setup/GroupChoiceScreen";
import CreateGroupScreen from "../screens/group-setup/CreateGroupScreen";
import JoinGroupScreen from "../screens/group-setup/JoinGroupScreen";

const Stack = createNativeStackNavigator();

export default function GroupSetupNavigator() {
  return (
    <Stack.Navigator initialRouteName="GroupChoice" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GroupChoice" component={GroupChoiceScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="JoinGroup" component={JoinGroupScreen} />
    </Stack.Navigator>
  );
}
