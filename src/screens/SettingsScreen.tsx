import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Colors, FontFamily, Radius, Shadow } from "../constants/brand";
import { useAuth } from "../contexts/AuthContext";
import { AppStackParamList } from "../types";

const AVATAR_COLORS = [
	Colors.peachSoft,
	Colors.lavSoft,
	Colors.mintSoft,
	Colors.skySoft,
	Colors.goldSoft,
	Colors.roseSoft,
];

const getInitials = (name: string): string =>
	name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const getAvatarColor = (name: string): string =>
	AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

type SettingsNav = NativeStackNavigationProp<AppStackParamList, "Settings">;

type SettingsRowProps = {
	icon: keyof typeof Ionicons.glyphMap;
	iconBg: string;
	title: string;
	subtitle?: string;
	onPress?: () => void;
	hideDivider?: boolean;
};

function SettingsRow({ icon, iconBg, title, subtitle, onPress, hideDivider }: SettingsRowProps) {
	return (
		<>
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
			>
				<View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
					<Ionicons name={icon} size={18} color={Colors.ink} />
				</View>
				<View style={styles.rowContent}>
					<Text style={styles.rowTitle}>{title}</Text>
					{subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
				</View>
				<Ionicons name="chevron-forward" size={18} color={Colors.ink3} />
			</Pressable>
			{!hideDivider && <View style={styles.divider} />}
		</>
	);
}

export default function SettingsScreen() {
	const navigation = useNavigation<SettingsNav>();
	const { session } = useAuth();
	const student = session!.student;
	const initials = getInitials(student.name);
	const avatarBg = getAvatarColor(student.name);

	return (
		<SafeAreaView style={styles.root} edges={["top", "bottom"]}>
			<View style={styles.header}>
				<Pressable
					onPress={() => navigation.goBack()}
					style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
				>
					<Ionicons name="chevron-back" size={22} color={Colors.ink} />
				</Pressable>
				<Text style={styles.headerTitle}>Configurações</Text>
				<View style={styles.backBtn} />
			</View>

			<ScrollView
				contentContainerStyle={styles.scroll}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.userCard}>
					<View style={[styles.avatar, { backgroundColor: avatarBg }]}>
						<Text style={styles.avatarText}>{initials}</Text>
					</View>
					<View style={styles.userInfo}>
						<Text style={styles.userName}>{student.name}</Text>
						<Text style={styles.userEmail}>{student.email}</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionLabel}>CONTA</Text>
					<View style={styles.sectionCard}>
						<SettingsRow
							icon="person-outline"
							iconBg={Colors.peachSoft}
							title="Editar perfil"
							subtitle="Nome, foto, curso"
						/>
						<SettingsRow
							icon="notifications-outline"
							iconBg={Colors.lavSoft}
							title="Notificações"
							subtitle="Lembretes de sequência, amigos"
						/>
						<SettingsRow
							icon="lock-closed-outline"
							iconBg={Colors.skySoft}
							title="Privacidade"
							subtitle="Quem vê seus check-ins"
							hideDivider
						/>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionLabel}>OUTROS</Text>
					<View style={styles.sectionCard}>
						<SettingsRow
							icon="information-circle-outline"
							iconBg={Colors.surface2}
							title="Sobre o Campus Quest"
							subtitle="v1.0.0"
						/>
						<SettingsRow
							icon="help-circle-outline"
							iconBg={Colors.surface2}
							title="Ajuda e suporte"
							hideDivider
						/>
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

	// ── Header ──
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	headerTitle: {
		fontFamily: FontFamily.display,
		fontSize: 20,
		letterSpacing: -0.4,
		color: Colors.ink,
	},
	backBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	backBtnPressed: {
		opacity: 0.5,
	},

	// ── Scroll ──
	scroll: {
		paddingHorizontal: 20,
		paddingTop: 8,
		paddingBottom: 40,
		gap: 24,
	},

	// ── User card ──
	userCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		backgroundColor: Colors.surface,
		borderRadius: Radius.card,
		padding: 16,
		...Shadow.e1,
	},
	avatar: {
		width: 52,
		height: 52,
		borderRadius: 26,
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: {
		fontFamily: FontFamily.display,
		fontSize: 20,
		color: Colors.ink,
		letterSpacing: -0.3,
	},
	userInfo: {
		flex: 1,
		gap: 2,
	},
	userName: {
		fontFamily: FontFamily.bodyBold,
		fontSize: 16,
		color: Colors.ink,
	},
	userEmail: {
		fontFamily: FontFamily.body,
		fontSize: 13,
		color: Colors.ink2,
	},

	// ── Section ──
	section: {
		gap: 8,
	},
	sectionLabel: {
		fontFamily: FontFamily.bodyBold,
		fontSize: 11,
		letterSpacing: 0.8,
		color: Colors.ink3,
		paddingHorizontal: 4,
	},
	sectionCard: {
		backgroundColor: Colors.surface,
		borderRadius: Radius.card,
		overflow: "hidden",
		...Shadow.e1,
	},

	// ── Row ──
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	rowPressed: {
		opacity: 0.7,
	},
	rowIcon: {
		width: 36,
		height: 36,
		borderRadius: Radius.tile,
		alignItems: "center",
		justifyContent: "center",
	},
	rowContent: {
		flex: 1,
		gap: 2,
	},
	rowTitle: {
		fontFamily: FontFamily.bodyBold,
		fontSize: 15,
		color: Colors.ink,
	},
	rowSubtitle: {
		fontFamily: FontFamily.body,
		fontSize: 12,
		color: Colors.ink2,
	},
	divider: {
		height: 1,
		backgroundColor: Colors.hair,
		marginLeft: 66,
	},
});
