import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { Colors, FontFamily, Radius, Shadow } from "../constants/brand";
import {
	AppStackParamList,
	MainTabsParamList,
	HomeScreenData,
} from "../types";
import { useAuth } from "../contexts/AuthContext";
import { getHome } from "../services/home";

type HomeNav = CompositeNavigationProp<
	BottomTabNavigationProp<MainTabsParamList, "Home">,
	NativeStackNavigationProp<AppStackParamList>
>;

// ── Avatar color rotation ───────────────────────────────────────────────────

const AVATAR_COLORS = [
	Colors.peach,
	Colors.mint,
	Colors.lav,
	Colors.sky,
	Colors.gold,
	Colors.rose,
] as const;

const getInitials = (name: string): string => {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

// ── Constants ────────────────────────────────────────────────────────────────

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

function formatDeadline(isoDatetime: string): string {
	const date = new Date(isoDatetime);
	const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
	return `Não quebre agora. Faça o check-in antes das ${time}.`;
}

function formatDateLabel(isoDate: string): string {
	const [year, month, day] = isoDate.split("-").map(Number);
	const date = new Date(year, month - 1, day);
	const weekday = date
		.toLocaleDateString("pt-BR", { weekday: "short" })
		.toUpperCase()
		.replace(/[.]/g, "");
	const monthStr = date
		.toLocaleDateString("pt-BR", { month: "short" })
		.toUpperCase()
		.replace(/[.]/g, "");
	return `${weekday} ${monthStr} ${String(day).padStart(2, "0")}`;
}

type UIState = "loading" | "error" | "success";

export default function HomeScreen() {
	const navigation = useNavigation<HomeNav>();
	const { session } = useAuth();
	const student = session!.student;
	const initials = getInitials(student.name);

	const [uiState, setUiState] = useState<UIState>("loading");
	const [data, setData] = useState<HomeScreenData | null>(null);

	let avatarColorIndex = 0;
	const nextAvatarColor = () => AVATAR_COLORS[avatarColorIndex++ % AVATAR_COLORS.length];

	const load = async () => {
		setUiState("loading");
		setData(null);

		try {
			const home = await getHome(student.id);
			setData(home);
			setUiState("success");
		} catch {
			setUiState("error");
		}
	};

	useEffect(() => {
		load()
	}, []);

	const handleCheckIn = () => navigation.navigate("CheckIn", { screen: "Camera" });

	// Loading
	if (uiState === "loading") {
		return (
			<SafeAreaView style={styles.centeredRoot} edges={["top", "bottom"]}>
				<ActivityIndicator color={Colors.peach} size="large" style={styles.shimSpinner} />
			</SafeAreaView>
		)
	};

	// Error
	if (uiState === "error") {
		return (
			<SafeAreaView style={styles.centeredRoot} edges={["top", "bottom"]}>
				<View style={styles.errorBox}>
					<Ionicons name="alert-circle-outline" size={48} color={Colors.ink3} />
					<Text style={styles.errorTitle}>Algo deu errado</Text>
					<Text style={styles.errorBody}>
						Não foi possível carregar os dados. Tente novamente.
					</Text>
					<Pressable
						onPress={load}
						style={({ pressed }) => [styles.retryBtn, pressed && styles.retryBtnPressed]}
					>
						<Text style={styles.retryBtnText}>Tentar novamente</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		);
	};

	return (
		<SafeAreaView style={styles.root} edges={["top", "bottom"]}>
			<ScrollView
				contentContainerStyle={styles.scroll}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.topBar}>
					<View style={styles.topBarLeft}>
						<View
							style={[
								styles.avatar,
								{ backgroundColor: nextAvatarColor() },
							]}
						>
							<Text style={styles.avatarText}>{initials}</Text>
						</View>
						<View style={styles.greetingCol}>
							<Text style={styles.greetingHey}>Oi,</Text>
							<Text style={styles.greetingName}>
								{student.name} <Text style={styles.greetingWave}>👋</Text>
							</Text>
						</View>
					</View>
					<Pressable
						style={({ pressed }) => [
							styles.bellBtn,
							pressed && styles.bellBtnPressed,
						]}
					>
						<Ionicons name="notifications-outline" size={24} color={Colors.ink} />
					</Pressable>
				</View>

				{
					data && data.streak.currentStreak > 0 &&
					<View style={styles.streakCard}>
					<View style={styles.streakHeader}>
						<View style={styles.streakIconWrap}>
							<Ionicons name="flame" size={22} color={Colors.surface} />
						</View>
						<View style={styles.streakTextCol}>
							<Text style={styles.streakTitle}>
								{data!.streak.currentStreak} dias de sequência
							</Text>
							<Text style={styles.streakSubtitle}>
								{formatDeadline(data!.streak.deadlineLabel)}
							</Text>
						</View>
					</View>
				</View>
				}
				

				<View style={styles.checkInCard}>
					<Text style={styles.checkInDate}>
						{formatDateLabel(data!.checkIn.dateLabel)}
					</Text>
					<Text style={styles.checkInHeading}>Tudo pronto quando você estiver.</Text>
					<Pressable
						onPress={handleCheckIn}
						style={({ pressed }) => [
							styles.checkInBtn,
							pressed && styles.checkInBtnPressed,
						]}
					>
						<Ionicons name="camera-outline" size={20} color={Colors.surface} />
						<Text style={styles.checkInBtnText}>
							Check-in | +{data!.checkIn.pointReward} pontos
						</Text>
					</Pressable>
				</View>

				<View style={styles.squadSection}>
					<View style={styles.squadHeader}>
						<Text style={styles.squadTitle}>Ranking da equipe</Text>
						<Pressable style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
							<Text style={styles.squadSeeAll}>Ver tudo →</Text>
						</Pressable>
					</View>
					<View style={styles.squadList}>
						{(data!.group?.members ?? []).slice(0, 3).map((entry, index) => {
							const rank = index + 1;
							const entryInitials = getInitials(entry.student.name);
							return (
								<View
									key={entry.student.id}
									style={[
										styles.rankRow,
										entry.isCurrentUser && styles.rankRowHighlight,
									]}
								>
									<Text style={styles.rankMedal}>
										{MEDALS[rank] ?? String(rank)}
									</Text>
									<View
										style={[
											styles.rankAvatar,
											{ backgroundColor: nextAvatarColor() },
										]}
									>
										<Text style={styles.rankAvatarText}>{entryInitials}</Text>
									</View>
									<Text style={styles.rankName} numberOfLines={1}>
										{entry.student.name}
									</Text>
									<Text style={styles.rankPoints}>
										{entry.points.toLocaleString("pt-BR")}
									</Text>
								</View>
							);
						})}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: Colors.bg,
	},
	centeredRoot: {
		flex: 1,
		backgroundColor: Colors.bg,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 24,
		gap: 16,
	},
	scroll: {
		paddingHorizontal: 24,
		paddingTop: 12,
		paddingBottom: 32,
		gap: 16,
	},
	shimSpinner: {
		marginTop: 8,
	},
	errorBox: {
		alignItems: "center",
		gap: 12,
	},
	errorTitle: {
		fontFamily: FontFamily.display,
		fontSize: 22,
		color: Colors.ink,
		letterSpacing: -0.5,
	},
	errorBody: {
		fontFamily: FontFamily.body,
		fontSize: 15,
		color: Colors.ink2,
		textAlign: "center",
		lineHeight: 22,
	},
	retryBtn: {
		marginTop: 8,
		height: 48,
		paddingHorizontal: 28,
		borderRadius: Radius.pill,
		backgroundColor: Colors.peach,
		alignItems: "center",
		justifyContent: "center",
		...Shadow.e1,
	},
	retryBtnPressed: {
		transform: [{ scale: 0.97 }],
		opacity: 0.9,
	},
	retryBtnText: {
		fontFamily: FontFamily.bodyBold,
		fontSize: 15,
		color: Colors.surface,
	},
	topBar: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingBottom: 8,
	},
	topBarLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	avatar: {
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: {
		fontFamily: FontFamily.bodyBold,
		fontSize: 15,
		color: Colors.ink,
	},
	greetingCol: {
		gap: 1,
	},
	greetingHey: {
		fontFamily: FontFamily.body,
		fontSize: 13,
		color: Colors.ink2,
	},
	greetingName: {
		fontFamily: FontFamily.bodyBold,
		fontSize: 17,
		color: Colors.ink,
		letterSpacing: -0.3,
	},
	greetingWave: {
		fontFamily: FontFamily.body,
		fontSize: 17,
	},
	bellBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.surface,
		alignItems: "center",
		justifyContent: "center",
		...Shadow.e1,
	},
	bellBtnPressed: {
		opacity: 0.6,
	},
	streakCard: {
		borderRadius: Radius.card,
		backgroundColor: Colors.peachSoft,
		padding: 20,
		gap: 16,
		...Shadow.e1,
	},
	streakHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
	},
	streakIconWrap: {
		width: 40,
		height: 40,
		borderRadius: Radius.tile,
		backgroundColor: Colors.peach,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
	},
	streakTextCol: {
		flex: 1,
		gap: 2,
	},
	streakTitle: {
		fontFamily: FontFamily.display,
		fontSize: 18,
		color: Colors.ink,
		letterSpacing: -0.4,
	},
	streakSubtitle: {
		fontFamily: FontFamily.body,
		fontSize: 13,
		color: Colors.ink2,
	},
	checkInCard: {
		borderRadius: Radius.card,
		backgroundColor: Colors.surface,
		padding: 20,
		gap: 16,
		...Shadow.e2,
	},
	checkInDate: {
		fontFamily: FontFamily.bodyBold,
		fontSize: 11,
		letterSpacing: 1.2,
		textTransform: "uppercase",
		color: Colors.ink3,
	},
	checkInHeading: {
		fontFamily: FontFamily.display,
		fontSize: 28,
		lineHeight: 32,
		letterSpacing: -0.8,
		color: Colors.ink,
	},
	checkInBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		height: 54,
		borderRadius: Radius.pill,
		backgroundColor: Colors.peach,
		...Shadow.e2,
	},
	checkInBtnPressed: {
		transform: [{ scale: 0.97 }],
		opacity: 0.92,
	},
	checkInBtnText: {
		fontFamily: FontFamily.bodyBold,
		fontSize: 16,
		color: Colors.surface,
	},

	// ── Squad section
	squadSection: {
		gap: 12,
	},
	squadHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	squadTitle: {
		fontFamily: FontFamily.display,
		fontSize: 20,
		color: Colors.ink,
		letterSpacing: -0.4,
	},
	squadSeeAll: {
		fontFamily: FontFamily.bodyBold,
		fontSize: 13,
		color: Colors.peach,
	},
	squadList: {
		gap: 10,
	},
	rankRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		backgroundColor: Colors.surface,
		borderRadius: Radius.tile,
		padding: 14,
		...Shadow.e1,
	},
	rankRowHighlight: {
		backgroundColor: Colors.peachSoft,
	},
	rankMedal: {
		fontSize: 22,
		width: 28,
		textAlign: "center",
	},
	rankAvatar: {
		width: 38,
		height: 38,
		borderRadius: 19,
		alignItems: "center",
		justifyContent: "center",
	},
	rankAvatarText: {
		fontFamily: FontFamily.bodyBold,
		fontSize: 13,
		color: Colors.ink,
	},
	rankName: {
		flex: 1,
		fontFamily: FontFamily.bodyBold,
		fontSize: 14,
		color: Colors.ink,
	},
	rankPoints: {
		fontFamily: FontFamily.bodyBold,
		fontSize: 14,
		color: Colors.ink2,
	},
});
