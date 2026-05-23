import { Pressable, Text, View } from "react-native";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppStackParamList, MainTabsParamList } from "../types";

type HomeNav = CompositeNavigationProp<
	BottomTabNavigationProp<MainTabsParamList, "Home">,
	NativeStackNavigationProp<AppStackParamList>
>;

export default function HomeScreen() {
	const navigation = useNavigation<HomeNav>();
	return (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<Text>Home</Text>
			<Pressable onPress={() => navigation.navigate("CheckIn", { screen: "Camera" })}>
				<Text>Fazer check-in</Text>
			</Pressable>
		</View>
	);
}
