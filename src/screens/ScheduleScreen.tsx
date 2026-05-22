import { useMemo } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ClassSession } from "../types/classes/class.schema";

const WEEKDAY_LABEL_BY_INDEX: Record<number, string> = {
    0: "Dom",
    1: "Seg",
    2: "Ter",
    3: "Qua",
    4: "Qui",
    5: "Sex",
    6: "Sab",
};

const initialSessions: ClassSession[] = [
    {
        id: "0d17ed61-fa92-4c7f-a101-b3ab0ce26837",
        date: "2026-10-23",
        course: {
            id: "58b3a37f-d391-446a-82bc-d090f81817ff",
            shortLabel: "EDA",
            name: "Estruturas de Dados Avançadas",
            teacher: "Dr. Sterling",
            location: "Bloco de Engenharia, 402",
            schedules: [
                { id: "7c9e6679-7425-40de-944b-e07fc1f90ae7", day: "THURSDAY", startsAt: "10:00:00", endsAt: "11:30:00" },
            ],
        },
        schedule: { id: "7c9e6679-7425-40de-944b-e07fc1f90ae7", day: "THURSDAY", startsAt: "10:00:00", endsAt: "11:30:00" },
        attendance: [],
    },
    {
        id: "5ab81098-33cd-40ee-a2fb-16d0f479f237",
        date: "2026-10-23",
        course: {
            id: "f90ad0eb-b112-4dad-a748-c6f833495deb",
            shortLabel: "PSI",
            name: "Psicologia de UI/UX",
            teacher: "Prof. Miller",
            location: "Laboratório de Design B",
            schedules: [
                { id: "8c9e6679-7425-40de-944b-e07fc1f90ae8", day: "THURSDAY", startsAt: "13:00:00", endsAt: "14:30:00" },
            ],
        },
        schedule: { id: "8c9e6679-7425-40de-944b-e07fc1f90ae8", day: "THURSDAY", startsAt: "13:00:00", endsAt: "14:30:00" },
        attendance: [],
    },
    {
        id: "2ba4dd7d-f0a7-4835-b19d-e26d7f0f339f",
        date: "2026-10-25",
        course: {
            id: "ef2c2fd2-9bc9-46ee-abf3-2f9d903f9ec4",
            shortLabel: "SO",
            name: "Sistemas Operacionais",
            teacher: "Dr. Khan",
            location: "Laboratório de Computação 304",
            schedules: [
                { id: "9c9e6679-7425-40de-944b-e07fc1f90ae9", day: "SATURDAY", startsAt: "15:30:00", endsAt: "17:00:00" },
            ],
        },
        schedule: { id: "9c9e6679-7425-40de-944b-e07fc1f90ae9", day: "SATURDAY", startsAt: "15:30:00", endsAt: "17:00:00" },
        attendance: [],
    },
];

const formatHour = (timeStr: string) => {
    const match = timeStr.match(/^(\d{2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : "--:--";
};

export default function ScheduleScreen() {
    const sessions = useMemo(
        () =>
            [...initialSessions].sort(
                (a, b) =>
                    new Date(`${a.date}T${a.schedule.startsAt}`).getTime() -
                    new Date(`${b.date}T${b.schedule.startsAt}`).getTime(),
            ),
        [],
    );

    const weekDays = useMemo(() => {
        return sessions.slice(0, 5).map((session, index) => {
            const sessionDate = new Date(session.date);
            return {
                id: session.id,
                label: WEEKDAY_LABEL_BY_INDEX[sessionDate.getDay()] ?? "",
                day: String(sessionDate.getDate()).padStart(2, "0"),
                active: index === 0,
            };
        });
    }, [sessions]);

    const nextSessionId = useMemo(() => {
        const now = Date.now();
        const nextSession = sessions.find(
            (session) => new Date(`${session.date}T${session.schedule.startsAt}`).getTime() >= now,
        );

        return nextSession?.id ?? sessions[0]?.id;
    }, [sessions]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.backgroundShapeTop} />
            <View style={styles.backgroundShapeBottom} />

            <View style={styles.topBar}>
                <View style={styles.brandArea}>
                    <View style={styles.brandIconBadge}>
                        <Ionicons name="flash" size={16} color="#0846ed" />
                    </View>
                    <Text style={styles.brandTitle}>CampusQuest</Text>
                </View>

                <Pressable style={styles.profileButton}>
                    <Image
                        source={{
                            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrUTNKzAH_Vd2OyaF4OMJeaSt76Tu5WkK9AeopvYit6BZ7Kfq-Sse7EURsrVT5mYsLGbgzoerAmwwhOGk5yaC5Ppv-Y0u1JNXK1AmQ3NVBOsjcZexbZKzjF2a_0Nsn7oV5IQ3HPSH2uRnOm64-xqNmZeSpEe6o31sUoiKpFfSpyOv5ViEQx8qQWQOUc9pToKfaXqispXcZfTILLjPDaSg8XN9wXC_gzFF-8OUcFEjovmNKcG7oQHuSJuAMS9mzOf118vbFDDpcQig",
                        }}
                        style={styles.profileImage}
                        resizeMode="cover"
                    />
                </Pressable>
            </View>

            <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Agenda Semanal</Text>
                    <View style={styles.weekPill}>
                        <Text style={styles.weekPillText}>23 - 27 Out</Text>
                    </View>
                </View>

                <View style={styles.weekGrid}>
                    {weekDays.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.dayItem, item.active ? styles.dayItemActive : null]}
                        >
                            <Text
                                style={[
                                    styles.dayLabel,
                                    item.active ? styles.dayLabelActive : styles.dayLabelInactive,
                                ]}
                            >
                                {item.label}
                            </Text>
                            <Text style={[styles.dayNumber, item.active ? styles.dayNumberActive : null]}>
                                {item.day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.sessionsHeaderRow}>
                    <Ionicons name="calendar-outline" size={18} color="#0846ed" />
                    <Text style={styles.sessionsHeaderText}>Aulas de Hoje</Text>
                </View>

                {sessions.map((session) => (
                    <View
                        key={session.id}
                        style={[styles.sessionCard, session.id === nextSessionId ? styles.nextSessionCard : null]}
                    >
                        <View style={styles.sessionInfoArea}>
                            <View style={styles.sessionMetaRow}>
                                <Text
                                    style={[
                                        styles.sessionTime,
                                        session.id === nextSessionId ? styles.sessionTimeNext : null,
                                    ]}
                                >
                                    {formatHour(session.schedule.startsAt)}{session.schedule.endsAt ? ` — ${formatHour(session.schedule.endsAt)}` : ""}
                                </Text>
                            </View>

                            <Text
                                style={[
                                    styles.sessionTitle,
                                    session.id === nextSessionId ? null : styles.sessionTitleDim,
                                ]}
                            >
                                {session.course.name}
                            </Text>
                        </View>

                        <View style={styles.cardFooter}>
                            <View style={styles.cardFooterItem}>
                                <Ionicons name="location-outline" size={14} color="#6d6c99" />
                                <Text style={styles.cardFooterText}>{session.course.location}</Text>
                            </View>

                            <View style={styles.cardFooterItem}>
                                <Ionicons name="person-outline" size={14} color="#6d6c99" />
                                <Text style={styles.cardFooterText}>{session.course.teacher}</Text>
                            </View>
                        </View>
                    </View>
                ))}

                <View style={styles.bottomSpacer} />
            </ScrollView>

            <Pressable style={styles.fab}>
                <Ionicons name="add" size={32} color="#ffffff" />
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f9f5ff",
    },
    backgroundShapeTop: {
        position: "absolute",
        top: -80,
        right: -30,
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: "#dfe2ff",
        opacity: 0.45,
    },
    backgroundShapeBottom: {
        position: "absolute",
        bottom: 90,
        left: -60,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: "#f0e7ff",
    },
    topBar: {
        marginTop: 8,
        marginHorizontal: 20,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.75)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "rgba(113,139,255,0.16)",
    },
    brandArea: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    brandIconBadge: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: "#e5ebff",
        alignItems: "center",
        justifyContent: "center",
    },
    brandTitle: {
        color: "#0846ed",
        fontSize: 18,
        fontWeight: "900",
        letterSpacing: -0.4,
    },
    profileButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 2,
        borderColor: "rgba(8,70,237,0.2)",
        overflow: "hidden",
    },
    profileImage: {
        width: "100%",
        height: "100%",
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionTitle: {
        fontSize: 29,
        fontWeight: "900",
        color: "#2b2a51",
        letterSpacing: -0.8,
    },
    weekPill: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: "#dcd9ff",
    },
    weekPillText: {
        color: "#585781",
        fontSize: 12,
        fontWeight: "600",
    },
    weekGrid: {
        marginTop: 18,
        marginBottom: 24,
        flexDirection: "row",
        gap: 8,
    },
    dayItem: {
        flex: 1,
        borderRadius: 16,
        minHeight: 70,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e9e5ff",
        gap: 2,
    },
    dayItemActive: {
        backgroundColor: "#0846ed",
        borderColor: "#0846ed",
        shadowColor: "#0846ed",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 18,
        elevation: 8,
    },
    dayLabel: {
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1,
        textTransform: "uppercase",
    },
    dayLabelActive: {
        color: "rgba(242,241,255,0.85)",
    },
    dayLabelInactive: {
        color: "#585781",
    },
    dayNumber: {
        fontSize: 24,
        fontWeight: "900",
        letterSpacing: -0.5,
    },
    dayNumberActive: {
        color: "#f2f1ff",
    },
    sessionsHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
    },
    sessionsHeaderText: {
        fontSize: 20,
        fontWeight: "800",
        color: "#2b2a51",
    },
    sessionCard: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 18,
        marginBottom: 14,
        shadowColor: "#2b2a51",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 22,
        elevation: 5,
    },
    nextSessionCard: {
        borderWidth: 1,
        borderColor: "#d7ddff",
    },
    sessionInfoArea: {
        width: "100%",
    },
    sessionMetaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        flexWrap: "wrap",
    },
    sessionTime: {
        fontSize: 11,
        fontWeight: "700",
        color: "#585781",
    },
    sessionTimeNext: {
        color: "#0846ed",
    },
    sessionTitle: {
        color: "#2b2a51",
        fontWeight: "900",
        fontSize: 23,
        lineHeight: 28,
        letterSpacing: -0.7,
    },
    sessionTitleDim: {
        color: "rgba(43,42,81,0.84)",
    },
    cardFooter: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#f0edff",
        gap: 8,
    },
    cardFooterItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    cardFooterText: {
        color: "#3f3e68",
        fontSize: 14,
        fontWeight: "600",
        flexShrink: 1,
    },
    fab: {
        position: "absolute",
        right: 22,
        bottom: 26,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#0846ed",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#0846ed",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 9,
    },
    bottomSpacer: {
        height: 100,
    },
});