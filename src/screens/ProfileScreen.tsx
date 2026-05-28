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
import { Ionicons } from "@expo/vector-icons";

import { Colors, FontFamily, Radius, Shadow } from "../constants/brand";
import { ProfileScreenData } from "../types";
import { useAuth } from "../contexts/AuthContext";

const getInitials = (name: string): string =>
	name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

function formatPoints(points: number): string {
	if (points >= 1000) return `${(points / 1000).toFixed(1).replace(".", ",")}k`;
	return points.toLocaleString("pt-BR");
}

const buildMock = (studentName: string): ProfileScreenData => ({
	student: {
		id: "00000000-0000-4000-a000-000000000001",
		name: studentName,
		email: "user@puc.edu",
		groupId: "00000000-0000-4000-a000-000000000010",
	},
	universityName: "Universidade Federal",
	stats: {
		checkIns: 142,
		currentStreak: 7,
		bestStreak: 23,
		points: 1700,
		rank: 2,
	},
});

type UIState = "loading" | "error" | "success";

export default function ProfileScreen() {
	const { session, signOut } = useAuth();
	const student = session!.student;

	const [uiState, setUiState] = useState<UIState>("loading");
	const [data, setData] = useState<ProfileScreenData | null>(null);

	const load = async () => {
		setUiState("loading");
		setData(null);
		try {
			await new Promise((r) => setTimeout(r, 800));
			setData(buildMock(student.name));
			setUiState("success");
		} catch {
			setUiState("error");
		}
	};

	useEffect(() => { load(); }, []);

	if (uiState === "loading") {
		return (
			<SafeAreaView style={styles.centeredRoot} edges={["top", "bottom"]}>
				<ActivityIndicator color={Colors.peach} size="large" />
			</SafeAreaView>
		);
	}

	if (uiState === "error") {
		return (
			<SafeAreaView style={styles.centeredRoot} edges={["top", "bottom"]}>
				<View style={styles.errorBox}>
					<Ionicons name="alert-circle-outline" size={48} color={Colors.ink3} />
					<Text style={styles.errorTitle}>Algo deu errado</Text>
					<Text style={styles.errorBody}>
						Não foi possível carregar seu perfil. Tente novamente.
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
	}

	const { universityName, stats } = data!;
	const initials = getInitials(student.name);

	return (
		<SafeAreaView style={styles.root} edges={["top", "bottom"]}>
			<ScrollView
				contentContainerStyle={styles.scroll}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.topBar}>
					<View />
					<Pressable
						style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
					>
						<Ionicons name="settings-outline" size={22} color={Colors.ink} />
					</Pressable>
				</View>

				<View style={styles.hero}>
					<View style={styles.avatarWrap}>
						<View style={styles.avatar}>
							<Text style={styles.avatarText}>{initials}</Text>
						</View>
						<View style={styles.cameraBtn}>
							<Ionicons name="camera" size={14} color={Colors.surface} />
						</View>
					</View>

					<Text style={styles.name}>{student.name}</Text>
					<Text style={styles.university}>{universityName}</Text>

					<View style={styles.pillRow}>
						<View style={[styles.pill, styles.pillPeach]}>
							<Text style={styles.pillText}>🔥 {stats.currentStreak} dias seguidos</Text>
						</View>
						<View style={[styles.pill, styles.pillLav]}>
							<Text style={styles.pillText}>Posição #{stats.rank}</Text>
						</View>
					</View>

					<Pressable
						style={({ pressed }) => [styles.editBtn, pressed && styles.editBtnPressed]}
					>
						<Text style={styles.editBtnText}>Editar perfil</Text>
					</Pressable>
				</View>

				<View style={styles.statsCard}>
					<View style={styles.statsRow}>
						<View style={styles.statCell}>
							<Text style={styles.statValue}>{stats.checkIns}</Text>
							<Text style={styles.statLabel}>Check-ins</Text>
						</View>
						<View style={styles.statDividerV} />
						<View style={styles.statCell}>
							<Text style={styles.statValue}>🔥 {stats.currentStreak}</Text>
							<Text style={styles.statLabel}>Sequência</Text>
						</View>
						<View style={styles.statDividerV} />
						<View style={styles.statCell}>
							<Text style={styles.statValue}>{stats.bestStreak}</Text>
							<Text style={styles.statLabel}>Melhor sequência</Text>
						</View>
					</View>

					<View style={styles.statDividerH} />

					<View style={[styles.statsRow, styles.statsRowCentered]}>
						<View style={[styles.statCell, styles.statCellWide]}>
							<Text style={styles.statValue}>{formatPoints(stats.points)}</Text>
							<Text style={styles.statLabel}>Pontos</Text>
						</View>
						<View style={styles.statDividerV} />
						<View style={[styles.statCell, styles.statCellWide]}>
							<Text style={styles.statValue}>#{stats.rank}</Text>
							<Text style={styles.statLabel}>Posição</Text>
						</View>
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
		paddingBottom: 40,
		gap: 24,
	},

	// Error
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
	},
	iconBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.surface,
		alignItems: "center",
		justifyContent: "center",
		...Shadow.e1,
	},
	iconBtnPressed: {
		opacity: 0.6,
	},
	hero: {
		alignItems: "center",
		gap: 10,
	},
	avatarWrap: {
		position: "relative",
		marginBottom: 4,
	},
	avatar: {
		width: 88,
		height: 88,
		borderRadius: 44,
		backgroundColor: Colors.peachSoft,
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: {
		fontFamily: FontFamily.display,
		fontSize: 30,
		color: Colors.ink,
		letterSpacing: -0.5,
	},
	cameraBtn: {
		position: "absolute",
		bottom: 2,
		right: 2,
		width: 26,
		height: 26,
		borderRadius: 13,
		backgroundColor: Colors.ink,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: Colors.bg,
	},
	name: {
		fontFamily: FontFamily.display,
		fontSize: 26,
		letterSpacing: -0.6,
		color: Colors.ink,
	},
	university: {
		fontFamily: FontFamily.body,
		fontSize: 14,
		color: Colors.ink2,
	},
	pillRow: {
		flexDirection: "row",
		gap: 8,
		marginTop: 2,
	},
	pill: {
		paddingHorizontal: 14,
		paddingVertical: 6,
		borderRadius: Radius.pill,
	},
	pillPeach: {
		backgroundColor: Colors.peachSoft,
	},
	pillLav: {
		backgroundColor: Colors.lavSoft,
	},
	pillText: {
		fontFamily: FontFamily.bodyBold,
		fontSize: 13,
		color: Colors.ink,
	},
	editBtn: {
		marginTop: 4,
		height: 44,
		paddingHorizontal: 28,
		borderRadius: Radius.pill,
		borderWidth: 1.5,
		borderColor: Colors.hair,
		backgroundColor: Colors.surface,
		alignItems: "center",
		justifyContent: "center",
		...Shadow.e1,
	},
	editBtnPressed: {
		opacity: 0.7,
	},
	editBtnText: {
		fontFamily: FontFamily.bodyBold,
		fontSize: 14,
		color: Colors.ink,
	},
	statsCard: {
		backgroundColor: Colors.surface,
		borderRadius: Radius.card,
		overflow: "hidden",
		...Shadow.e1,
	},
	statsRow: {
		flexDirection: "row",
		alignItems: "stretch",
	},
	statsRowCentered: {
		justifyContent: "center",
	},
	statCell: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 20,
		gap: 4,
	},
	statCellWide: {
		flex: 0,
		width: "40%",
	},
	statValue: {
		fontFamily: FontFamily.display,
		fontSize: 22,
		letterSpacing: -0.5,
		color: Colors.ink,
	},
	statLabel: {
		fontFamily: FontFamily.body,
		fontSize: 12,
		color: Colors.ink3,
	},
	statDividerV: {
		width: 1,
		backgroundColor: Colors.hair,
		marginVertical: 14,
	},
	statDividerH: {
		height: 1,
		backgroundColor: Colors.hair,
	},
});
