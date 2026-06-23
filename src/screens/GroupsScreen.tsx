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
import { Group } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { getGroup } from "../services/groups";
import { AVATAR_COLORS, getInitials } from "../utils/avatar";

type UIState = "loading" | "error" | "success";

export default function GroupsScreen() {
    const { session } = useAuth();
    const [uiState, setUiState] = useState<UIState>("loading");
    const [data, setData] = useState<Group | null>(null);

    const load = async () => {
        setUiState("loading");
        setData(null);
        try {
            const groupId = session!.student.groupId!;
            setData(await getGroup(groupId));
            setUiState("success");
        } catch {
            setUiState("error");
        }
    };

    useEffect(() => {
        load();
    }, []);

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
    }

    const group = data!;
    const groupInitials = getInitials(group.name);

    return (
        <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Hero card ── */}
                <View style={styles.heroCard}>
                    <View style={styles.heroTop}>
                        <View style={styles.groupAvatar}>
                            <Text style={styles.groupAvatarText}>{groupInitials}</Text>
                        </View>
                        <View style={styles.groupInfo}>
                            <Text style={styles.groupName}>{group.name}</Text>
                            <Text style={styles.groupMeta}>
                                Grupo fechado · {group.memberCount} membros
                            </Text>
                        </View>
                        <Pressable
                            style={({ pressed }) => [styles.settingsBtn, pressed && { opacity: 0.6 }]}
                        >
                            <Ionicons name="settings-outline" size={20} color={Colors.ink2} />
                        </Pressable>
                    </View>

                    <View style={styles.heroDivider} />

                    <View style={styles.statsRow}>
                        <View style={styles.statTile}>
                            <Text style={styles.statLabel}>Esta semana</Text>
                            <Text style={styles.statValue}>{group.weeklyCheckIns} check-ins</Text>
                        </View>
                        <View style={styles.statTile}>
                            <Text style={styles.statLabel}>Mais ativo</Text>
                            <Text style={styles.statValue} numberOfLines={1}>
                                {group.members[0]?.student.name ?? "—"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ── Invite card ── */}
                <View style={styles.inviteCard}>
                    <View style={styles.inviteLeft}>
                        <View style={styles.inviteIconWrap}>
                            <Ionicons name="share-social-outline" size={18} color={Colors.peach} />
                        </View>
                        <View style={styles.inviteTextCol}>
                            <Text style={styles.inviteTitle}>Convide um amigo</Text>
                            <View style={styles.codeChip}>
                                <Text style={styles.codeText}>{group.inviteCode}</Text>
                            </View>
                        </View>
                    </View>
                    <Pressable
                        style={({ pressed }) => [styles.shareBtn, pressed && styles.shareBtnPressed]}
                    >
                        <Text style={styles.shareBtnText}>Compartilhar</Text>
                    </Pressable>
                </View>

                {/* ── Members section ── */}
                <View style={styles.membersSection}>
                    <View style={styles.membersHeader}>
                        <Text style={styles.membersTitle}>Membros</Text>
                        <Text style={styles.membersCount}>
                            {group.memberCount} / {group.memberLimit}
                        </Text>
                    </View>

                    <View style={styles.membersList}>
                        {group.members.map((entry, index) => {
                            const rank = index + 1;
                            const initials = getInitials(entry.student.name);
                            const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
                            const isLast = index === group.members.length - 1;
                            return (
                                <View key={entry.student.id}>
                                    <View
                                        style={[
                                            styles.memberRow,
                                            entry.isCurrentUser && styles.memberRowHighlight,
                                        ]}
                                    >
                                        <Text style={styles.memberRank}>{rank}</Text>
                                        <View style={[styles.memberAvatar, { backgroundColor: avatarColor }]}>
                                            <Text style={styles.memberAvatarText}>{initials}</Text>
                                        </View>
                                        <Text style={styles.memberName} numberOfLines={1}>
                                            {entry.student.name}
                                        </Text>
                                        <Text style={styles.memberPoints}>
                                            {entry.points.toLocaleString("pt-BR")}
                                        </Text>
                                    </View>
                                    {!isLast && <View style={styles.memberDivider} />}
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

    // ── Error state
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

    // ── Hero card
    heroCard: {
        borderRadius: Radius.card,
        backgroundColor: Colors.lavSoft,
        padding: 20,
        gap: 16,
        ...Shadow.e1,
    },
    heroTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    groupAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.lav,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    groupAvatarText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 18,
        color: Colors.ink,
    },
    groupInfo: {
        flex: 1,
        gap: 2,
    },
    groupName: {
        fontFamily: FontFamily.display,
        fontSize: 22,
        color: Colors.ink,
        letterSpacing: -0.5,
    },
    groupMeta: {
        fontFamily: FontFamily.body,
        fontSize: 13,
        color: Colors.ink2,
    },
    settingsBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.surface,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...Shadow.e1,
    },
    heroDivider: {
        height: 1,
        backgroundColor: Colors.hair,
    },
    statsRow: {
        flexDirection: "row",
        gap: 10,
    },
    statTile: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: Radius.tile,
        padding: 12,
        gap: 4,
    },
    statLabel: {
        fontFamily: FontFamily.body,
        fontSize: 12,
        color: Colors.ink3,
        letterSpacing: 0.2,
    },
    statValue: {
        fontFamily: FontFamily.display,
        fontSize: 18,
        color: Colors.ink,
        letterSpacing: -0.4,
    },

    // ── Invite card
    inviteCard: {
        borderRadius: Radius.card,
        backgroundColor: Colors.surface,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        ...Shadow.e1,
    },
    inviteLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    inviteIconWrap: {
        width: 40,
        height: 40,
        borderRadius: Radius.tile,
        backgroundColor: Colors.peachSoft,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    inviteTextCol: {
        gap: 4,
    },
    inviteTitle: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 14,
        color: Colors.ink,
    },
    codeChip: {
        alignSelf: "flex-start",
        backgroundColor: Colors.surface2,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    codeText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 12,
        color: Colors.ink2,
        letterSpacing: 1.5,
    },
    shareBtn: {
        height: 40,
        paddingHorizontal: 18,
        borderRadius: Radius.pill,
        backgroundColor: Colors.peach,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    shareBtnPressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.9,
    },
    shareBtnText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 14,
        color: Colors.surface,
    },

    // ── Members section
    membersSection: {
        gap: 12,
    },
    membersHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    membersTitle: {
        fontFamily: FontFamily.display,
        fontSize: 20,
        color: Colors.ink,
        letterSpacing: -0.4,
    },
    membersCount: {
        fontFamily: FontFamily.body,
        fontSize: 13,
        color: Colors.ink3,
    },
    membersList: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.card,
        overflow: "hidden",
        ...Shadow.e1,
    },
    memberRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    memberRowHighlight: {
        backgroundColor: Colors.peachSoft,
    },
    memberRank: {
        fontFamily: FontFamily.body,
        fontSize: 13,
        color: Colors.ink3,
        width: 20,
        textAlign: "center",
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    memberAvatarText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 14,
        color: Colors.ink,
    },
    memberName: {
        flex: 1,
        fontFamily: FontFamily.bodyBold,
        fontSize: 15,
        color: Colors.ink,
    },
    memberPoints: {
        fontFamily: FontFamily.display,
        fontSize: 16,
        color: Colors.ink,
        letterSpacing: -0.3,
    },
    memberDivider: {
        height: 1,
        backgroundColor: Colors.hair,
        marginLeft: 68,
    },
});
