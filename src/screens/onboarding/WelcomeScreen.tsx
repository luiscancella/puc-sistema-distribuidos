import { useMemo } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { OnboardingStackParamList } from "../../types/navigation/onboarding.stack";

const CAMPUS_IMAGE_URI = "https://lh3.googleusercontent.com/aida-public/AB6AXuCU6tH4Dy8ZiHl4WEsZCEfdAgS2ElAsvbX1XF-H9fkuMmZ78d0HyWjh9dM86nZ8Hq8AuDaQwiPltojh8nzAOYl06YHyMyATPqZ63zceWPFWQNyCCppp-B4nVep1KO5_ynaY9GpBS4OM31-SkLqgg0HWvD97agxkh5hxJD8-MMbIN3etMKi6CKIlTXQVst67Pv1Ju1UgFP2IAid0OS1PGfdJLYT-c25QQ-2Lk0R0pb_8VLsuYox_tm7ftYeMKf6F441qP-y9UuLCSrc";

export default function WelcomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { width } = Dimensions.get("window");

    const heroSize = useMemo(() => {
        const horizontalPadding = 24 * 2;
        const maxCardWidth = 420;
        return Math.min(width - horizontalPadding, maxCardWidth);
    }, [width]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.backgroundBlobTop} />
            <View style={styles.backgroundBlobBottom} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.heroContainer, { width: heroSize }]}>
                    <View style={styles.heroImageWrap}>
                        <Image source={{ uri: CAMPUS_IMAGE_URI }} style={styles.heroImage} />
                        <View style={styles.imageOverlay} />
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <Text style={styles.title}>CampusQuest</Text>
                    <Text style={styles.subtitle}>"Não perca sua próxima aula!"</Text>

                    <Pressable
                        onPress={() => navigation.replace("Register")}
                        style={({ pressed }) => [
                            styles.primaryButton,
                            pressed && styles.primaryButtonPressed,
                        ]}
                    >
                        <Text style={styles.primaryButtonText}>Começar</Text>
                    </Pressable>

                    <View style={styles.secondaryActionRow}>
                        <Text style={styles.secondaryActionText}>Já tem uma conta? </Text>
                        <Pressable onPress={() => navigation.replace("Login")}>
                            <Text style={styles.secondaryActionLink}>Entrar</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.progressRow}>
                    <View style={styles.progressActive} />
                    <View style={styles.progressInactive} />
                    <View style={styles.progressInactive} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F9F5FF",
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 30,
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
    },
    backgroundBlobTop: {
        position: "absolute",
        top: -90,
        left: -90,
        width: 280,
        height: 280,
        borderRadius: 999,
        backgroundColor: "rgba(8, 70, 237, 0.14)",
    },
    backgroundBlobBottom: {
        position: "absolute",
        right: -110,
        bottom: -120,
        width: 260,
        height: 260,
        borderRadius: 999,
        backgroundColor: "rgba(0, 105, 68, 0.12)",
    },
    heroContainer: {
        maxWidth: 420,
        width: "100%",
    },
    heroImageWrap: {
        width: "100%",
        aspectRatio: 4 / 3,
        borderRadius: 24,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
    },
    heroImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(8, 70, 237, 0.26)",
    },
    contentContainer: {
        width: "100%",
        maxWidth: 420,
        alignItems: "center",
        gap: 14,
    },
    title: {
        fontSize: 44,
        lineHeight: 48,
        fontWeight: "900",
        color: "#0846ED",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: "500",
        color: "#585781",
        textAlign: "center",
        marginBottom: 8,
    },
    primaryButton: {
        width: "100%",
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: "#0846ED",
        shadowColor: "#0846ED",
        shadowOpacity: 0.28,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
    },
    primaryButtonPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.94,
    },
    primaryButtonText: {
        fontSize: 20,
        lineHeight: 24,
        fontWeight: "800",
        color: "#F2F1FF",
        textAlign: "center",
    },
    secondaryActionRow: {
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    secondaryActionText: {
        fontSize: 14,
        lineHeight: 20,
        color: "#585781",
    },
    secondaryActionLink: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "800",
        color: "#0846ED",
    },
    progressRow: {
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    progressActive: {
        width: 46,
        height: 6,
        borderRadius: 99,
        backgroundColor: "#0846ED",
    },
    progressInactive: {
        width: 10,
        height: 6,
        borderRadius: 99,
        backgroundColor: "#DCD9FF",
    },
});