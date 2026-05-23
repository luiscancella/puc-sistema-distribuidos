import { useRef, useState, useEffect } from "react";
import {
    ActivityIndicator,
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Colors, FontFamily, Radius, Shadow } from "../../constants/brand";
import LogoMark from "../../components/LogoMark";
import { CheckInStackParamList } from "../../types";

type TimerSeconds = 0 | 3 | 5;

const MOCK_CLASS = {
    courseName: "Engenharia de Software",
};

const TIMER_CYCLE: TimerSeconds[] = [0, 3, 5];
const DARK_PILL = "rgba(31,26,46,0.60)";

export default function CameraScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<CheckInStackParamList>>();
    const [permission, requestPermission] = useCameraPermissions();

    const [facing, setFacing] = useState<CameraType>("front");
    const [flash, setFlash] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState<TimerSeconds>(0);
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const cameraRef = useRef<CameraView>(null);
    const shutterScale = useRef(new Animated.Value(1)).current;
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    function animateShutter() {
        Animated.sequence([
            Animated.timing(shutterScale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
            Animated.timing(shutterScale, { toValue: 1, duration: 120, useNativeDriver: true }),
        ]).start();
    }

    async function capture() {
        animateShutter();
        try {
            const result = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
            if (!result?.uri) throw new Error();
            navigation.navigate("Confirm", {
                photoUri: result.uri,
                courseName: MOCK_CLASS.courseName,
            });
        } catch {
            setError("Não foi possível tirar a foto. Tente novamente.");
        }
    }

    function handleShutter() {
        if (countdown > 0) return;
        setError(null);

        if (timerSeconds === 0) {
            capture();
            return;
        }

        let tick = timerSeconds;
        setCountdown(tick);
        intervalRef.current = setInterval(() => {
            tick -= 1;
            setCountdown(tick);
            if (tick <= 0) {
                clearInterval(intervalRef.current!);
                intervalRef.current = null;
                capture();
            }
        }, 1000);
    }

    function cycleTimer() {
        const next = (TIMER_CYCLE.indexOf(timerSeconds) + 1) % TIMER_CYCLE.length;
        setTimerSeconds(TIMER_CYCLE[next]);
    }

    if (!permission) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color={Colors.peach} size="large" />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.center}>
                <View style={styles.permissionCard}>
                    <LogoMark size={52} />
                    <View style={styles.permissionText}>
                        <Text style={styles.permissionTitle}>Precisamos da câmera.</Text>
                        <Text style={styles.permissionBody}>
                            Para registrar sua presença, precisamos tirar uma foto. Sem câmera, sem check-in.
                        </Text>
                    </View>
                    <Pressable
                        onPress={requestPermission}
                        style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
                    >
                        <Text style={styles.primaryBtnText}>Permitir acesso</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.root}>
            <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                facing={facing}
                enableTorch={flash}
            />

            {/* Top bar */}
            <View style={styles.topBar}>
                <View style={styles.iconBtn} />
                <View style={styles.coursePill}>
                    <View style={styles.greenDot} />
                    <Text style={styles.coursePillText} numberOfLines={1}>
                        {MOCK_CLASS.courseName}
                    </Text>
                </View>
                <Pressable
                    onPress={() => setFacing(f => f === "front" ? "back" : "front")}
                    style={styles.iconBtn}
                    hitSlop={8}
                >
                    <Ionicons name="camera-reverse-outline" size={22} color="#fff" />
                </Pressable>
            </View>

            {/* Error banner */}
            {error && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable onPress={() => setError(null)} hitSlop={8}>
                        <Text style={styles.errorRetry}>Tentar novamente</Text>
                    </Pressable>
                </View>
            )}

            {/* Countdown overlay */}
            {countdown > 0 && (
                <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                    <View style={styles.countdownOverlay}>
                        <Text style={styles.countdownText}>{countdown}</Text>
                    </View>
                </View>
            )}

            {/* Bottom controls */}
            <SafeAreaView edges={["bottom"]} style={styles.bottomControls}>
                {countdown === 0 && !error && (
                    <Text style={styles.hint}>Toque para registrar presença</Text>
                )}
                <View style={styles.shutterRow}>
                    <Pressable onPress={() => setFlash(v => !v)} style={styles.sideBtn} hitSlop={8}>
                        <Ionicons
                            name={flash ? "flash" : "flash-off"}
                            size={24}
                            color={flash ? Colors.peach : "rgba(255,255,255,0.65)"}
                        />
                    </Pressable>

                    <Pressable onPress={handleShutter} disabled={countdown > 0}>
                        <Animated.View style={[styles.shutterOuter, { transform: [{ scale: shutterScale }] }]}>
                            <View style={styles.shutterInner} />
                        </Animated.View>
                    </Pressable>

                    <Pressable onPress={cycleTimer} style={styles.sideBtn} hitSlop={8}>
                        <Ionicons
                            name="timer-outline"
                            size={24}
                            color={timerSeconds > 0 ? Colors.peach : "rgba(255,255,255,0.65)"}
                        />
                        {timerSeconds > 0 && (
                            <Text style={styles.timerLabel}>{timerSeconds}s</Text>
                        )}
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#000",
    },
    center: {
        flex: 1,
        backgroundColor: Colors.bg,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },

    // ── Permission ────────────────────────────────────────────────────
    permissionCard: {
        alignItems: "center",
        gap: 24,
        maxWidth: 340,
    },
    permissionText: {
        gap: 8,
        alignItems: "center",
    },
    permissionTitle: {
        fontFamily: FontFamily.display,
        fontSize: 32,
        lineHeight: 34,
        letterSpacing: -1.1,
        color: Colors.ink,
        textAlign: "center",
    },
    permissionBody: {
        fontFamily: FontFamily.body,
        fontSize: 15,
        lineHeight: 22,
        color: Colors.ink2,
        textAlign: "center",
    },
    primaryBtn: {
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.peach,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
        ...Shadow.e2,
    },
    btnPressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.9,
    },
    primaryBtnText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 17,
        color: "#fff",
        letterSpacing: -0.17,
    },

    // ── Top bar ───────────────────────────────────────────────────────
    topBar: {
        position: "absolute",
        top: 60,
        left: 16,
        right: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: DARK_PILL,
        alignItems: "center",
        justifyContent: "center",
    },
    coursePill: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        height: 40,
        borderRadius: 20,
        backgroundColor: DARK_PILL,
        paddingHorizontal: 14,
    },
    greenDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.mint,
    },
    coursePillText: {
        flex: 1,
        fontFamily: FontFamily.body,
        fontSize: 14,
        color: "#fff",
        letterSpacing: -0.07,
    },

    // ── Error banner ──────────────────────────────────────────────────
    errorBanner: {
        position: "absolute",
        top: 120,
        left: 16,
        right: 16,
        backgroundColor: Colors.peachSoft,
        borderRadius: Radius.tile,
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 4,
        alignItems: "center",
    },
    errorText: {
        fontFamily: FontFamily.body,
        fontSize: 14,
        color: "#E05A3A",
        textAlign: "center",
    },
    errorRetry: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 13,
        color: Colors.peach,
    },

    // ── Countdown ─────────────────────────────────────────────────────
    countdownOverlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    countdownText: {
        fontFamily: FontFamily.display,
        fontSize: 120,
        lineHeight: 120,
        color: "#fff",
        letterSpacing: -4,
        opacity: 0.9,
    },

    // ── Bottom controls ───────────────────────────────────────────────
    bottomControls: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        gap: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    hint: {
        fontFamily: FontFamily.body,
        fontSize: 14,
        color: "rgba(255,255,255,0.75)",
        letterSpacing: -0.07,
    },
    shutterRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
    },
    sideBtn: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: DARK_PILL,
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
    },
    timerLabel: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 10,
        color: Colors.peach,
        lineHeight: 12,
    },
    shutterOuter: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 4,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    shutterInner: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: "#fff",
    },
});
