import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { Colors, FontFamily, Radius, Shadow } from "../../constants/brand";
import { AppStackParamList, CheckInStackParamList } from "../../types";

export default function SuccessScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<CheckInStackParamList>>();
    const { pointsEarned, streakCount } = useRoute<RouteProp<CheckInStackParamList, "Success">>().params;

    return (
        <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
            <View style={styles.content}>
                <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={56} color="#fff" />
                </View>

                <View style={styles.textBlock}>
                    <Text style={styles.title}>Mandou bem.</Text>
                    <Text style={styles.subtitle}>Presença registrada.</Text>
                </View>

                <View style={styles.cardsRow}>
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>Pontos</Text>
                        <Text style={styles.cardValuePeach}>+{pointsEarned}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>Sequência</Text>
                        <Text style={styles.cardValueInk}>🔥 {streakCount}</Text>
                    </View>
                </View>
            </View>

            <Pressable
                onPress={() => {
                    navigation
                        .getParent<NativeStackNavigationProp<AppStackParamList>>()
                        ?.reset({ index: 0, routes: [{ name: "Main" }] });
                }}
                style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
            >
                <Text style={styles.backBtnText}>Voltar ao início</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.mintSoft,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },

    // ── Content ───────────────────────────────────────────────────────
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
    },
    checkCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.mint,
        alignItems: "center",
        justifyContent: "center",
        ...Shadow.e2,
    },

    // ── Text ──────────────────────────────────────────────────────────
    textBlock: {
        alignItems: "center",
        gap: 8,
    },
    title: {
        fontFamily: FontFamily.display,
        fontSize: 40,
        lineHeight: 42,
        letterSpacing: -1.5,
        color: Colors.ink,
        textAlign: "center",
    },
    subtitle: {
        fontFamily: FontFamily.body,
        fontSize: 16,
        lineHeight: 24,
        color: Colors.ink2,
        textAlign: "center",
    },

    // ── Metric cards ──────────────────────────────────────────────────
    cardsRow: {
        flexDirection: "row",
        gap: 12,
        alignSelf: "stretch",
    },
    card: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: Radius.card,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: "center",
        gap: 6,
        ...Shadow.e1,
    },
    cardLabel: {
        fontFamily: FontFamily.body,
        fontSize: 13,
        color: Colors.ink2,
        letterSpacing: -0.07,
    },
    cardValuePeach: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 28,
        lineHeight: 30,
        letterSpacing: -0.8,
        color: Colors.peach,
    },
    cardValueInk: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 28,
        lineHeight: 30,
        letterSpacing: -0.8,
        color: Colors.ink,
    },

    // ── Back button ───────────────────────────────────────────────────
    backBtn: {
        height: 54,
        borderRadius: Radius.pill,
        backgroundColor: Colors.ink,
        alignItems: "center",
        justifyContent: "center",
        ...Shadow.e2,
    },
    btnPressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.9,
    },
    backBtnText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 17,
        color: "#fff",
        letterSpacing: -0.17,
    },
});
