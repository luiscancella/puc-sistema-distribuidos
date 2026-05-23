import { useState } from "react";
import {
    ActivityIndicator,
    Image,
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
import { CheckInStackParamList } from "../../types";

type ConfirmNav = NativeStackNavigationProp<CheckInStackParamList, "Confirm">;
type ConfirmRoute = RouteProp<CheckInStackParamList, "Confirm">;

const DARK_PILL = "rgba(31,26,46,0.60)";


export default function ConfirmScreen() {
    const navigation = useNavigation<ConfirmNav>();
    const { photoUri, courseName } = useRoute<ConfirmRoute>().params;

    const [submitting, setSubmitting] = useState(false);

    async function handleConfirm() {
        setSubmitting(true);
        // TODO: send to backend
        await new Promise(r => setTimeout(r, 1500));
        navigation.navigate("Success");
    }

    return (
        <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
            {/* Photo card */}
            <View style={styles.photoWrapper}>
                <Image source={{ uri: photoUri }} style={styles.photo} />
                <View style={styles.coursePill}>
                    <Ionicons name="location-sharp" size={13} color="#fff" />
                    <Text style={styles.coursePillText} numberOfLines={1}>
                        {courseName}
                    </Text>
                </View>
            </View>

            {/* Text */}
            <View style={styles.textBlock}>
                <Text style={styles.title}>Ficou ótima.</Text>
                <Text style={styles.subtitle}>Confirme para registrar sua presença.</Text>
            </View>

            {/* Buttons */}
            <View style={styles.footer}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    disabled={submitting}
                    style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && styles.btnPressed]}
                >
                    <Text style={styles.btnGhostText}>Tirar outra</Text>
                </Pressable>
                <Pressable
                    onPress={handleConfirm}
                    disabled={submitting}
                    style={({ pressed }) => [styles.btn, styles.btnInk, pressed && styles.btnPressed]}
                >
                    <Text style={styles.btnInkText}>Confirmar check-in</Text>
                </Pressable>
            </View>

            {/* Submitting overlay */}
            {submitting && (
                <View style={styles.dimOverlay}>
                    <ActivityIndicator color="#fff" size="large" />
                    <Text style={styles.submittingText}>Registrando presença…</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.bg,
        paddingHorizontal: 24,
        paddingTop: 16,
        gap: 24,
    },

    // ── Photo ─────────────────────────────────────────────────────────
    photoWrapper: {
        flex: 1,
        borderRadius: Radius.photo,
        overflow: "hidden",
        ...Shadow.e2,
    },
    photo: {
        flex: 1,
        resizeMode: "cover",
    },
    coursePill: {
        position: "absolute",
        top: 14,
        left: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        height: 36,
        borderRadius: Radius.pill,
        backgroundColor: DARK_PILL,
        paddingHorizontal: 12,
    },
    coursePillText: {
        fontFamily: FontFamily.body,
        fontSize: 13,
        color: "#fff",
        letterSpacing: -0.07,
    },

    // ── Text ──────────────────────────────────────────────────────────
    textBlock: {
        gap: 6,
    },
    title: {
        fontFamily: FontFamily.display,
        fontSize: 34,
        lineHeight: 36,
        letterSpacing: -1.2,
        color: Colors.ink,
    },
    subtitle: {
        fontFamily: FontFamily.body,
        fontSize: 15,
        lineHeight: 22,
        color: Colors.ink2,
    },

    // ── Footer ────────────────────────────────────────────────────────
    footer: {
        flexDirection: "row",
        gap: 12,
        paddingBottom: 24,
    },
    btn: {
        flex: 1,
        height: 54,
        borderRadius: Radius.pill,
        alignItems: "center",
        justifyContent: "center",
    },
    btnGhost: {
        borderWidth: 1.5,
        borderColor: Colors.ink,
    },
    btnInk: {
        backgroundColor: Colors.ink,
        ...Shadow.e2,
    },
    btnPressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.9,
    },
    btnGhostText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 16,
        color: Colors.ink,
        letterSpacing: -0.16,
    },
    btnInkText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 16,
        color: "#fff",
        letterSpacing: -0.16,
    },

    // ── Submitting overlay ────────────────────────────────────────────
    dimOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(31,26,46,0.72)",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
    submittingText: {
        fontFamily: FontFamily.body,
        fontSize: 16,
        color: "#fff",
        letterSpacing: -0.08,
    },
});
