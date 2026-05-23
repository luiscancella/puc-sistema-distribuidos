import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppStackParamList } from "../types";

export default function HomeScreen() {
	const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
	return (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<Text>Home</Text>
			<Pressable onPress={() => navigation.navigate("CheckIn", { screen: "Camera" })}>
				<Text>Fazer check-in</Text>
			</Pressable>
		</View>
	);
}
