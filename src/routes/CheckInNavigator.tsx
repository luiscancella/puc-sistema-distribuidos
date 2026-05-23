import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CameraScreen from "../screens/check-in/CameraScreen";
import ConfirmScreen from "../screens/check-in/ConfirmScreen";
import SuccessScreen from "../screens/check-in/SuccessScreen";
import { CheckInStackParamList } from "../types";

const Stack = createNativeStackNavigator<CheckInStackParamList>();

export default function CheckInNavigator() {
  return (
    <Stack.Navigator initialRouteName="Camera" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Confirm" component={ConfirmScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
    </Stack.Navigator>
  );
}
