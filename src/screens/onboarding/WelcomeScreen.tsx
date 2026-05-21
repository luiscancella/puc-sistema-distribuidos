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
import { Colors, FontFamily, Radius, Shadow } from "../../constants/brand";
import LogoMark from "../../components/LogoMark";

const CAMPUS_IMAGE_URI =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCU6tH4Dy8ZiHl4WEsZCEfdAgS2ElAsvbX1XF-H9fkuMmZ78d0HyWjh9dM86nZ8Hq8AuDaQwiPltojh8nzAOYl06YHyMyATPqZ63zceWPFWQNyCCppp-B4nVep1KO5_ynaY9GpBS4OM31-SkLqgg0HWvD97agxkh5hxJD8-MMbIN3etMKi6CKIlTXQVst67Pv1Ju1UgFP2IAid0OS1PGfdJLYT-c25QQ-2Lk0R0pb_8VLsuYox_tm7ftYeMKf6F441qP-y9UuLCSrc";

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
            <View style={styles.blobTopLeft} />
            <View style={styles.blobBottomRight} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <LogoMark />

                <View style={[styles.heroContainer, { width: heroSize }]}>
                    <View style={styles.heroImageWrap}>
                        <Image source={{ uri: CAMPUS_IMAGE_URI }} style={styles.heroImage} />
                        <View style={styles.imageOverlay} />
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Campus Quest.</Text>
                    <Text style={styles.subtitle}>"Não perca sua próxima aula!"</Text>
                </View>

                <Pressable
                    onPress={() => navigation.navigate("Register")}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        pressed && styles.primaryButtonPressed,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>Começar</Text>
                </Pressable>

                <View style={styles.secondaryActionRow}>
                    <Text style={styles.secondaryActionText}>Já tem uma conta? </Text>
                    <Pressable onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.secondaryActionLink}>Entrar</Text>
                    </Pressable>
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
        backgroundColor: Colors.bg,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 32,
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
    },
    blobTopLeft: {
        position: "absolute",
        top: -80,
        left: -80,
        width: 220,
        height: 220,
        borderRadius: Radius.pill,
        backgroundColor: Colors.peachSoft,
        opacity: 0.7,
    },
    blobBottomRight: {
        position: "absolute",
        right: -80,
        bottom: -80,
        width: 200,
        height: 200,
        borderRadius: Radius.pill,
        backgroundColor: Colors.mintSoft,
        opacity: 0.6,
    },
    heroContainer: {
        maxWidth: 420,
        width: "100%",
    },
    heroImageWrap: {
        width: "100%",
        aspectRatio: 4 / 3,
        borderRadius: Radius.photo,
        overflow: "hidden",
        backgroundColor: Colors.surface2,
        ...Shadow.e2,
    },
    heroImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255, 138, 107, 0.18)",
    },
    contentContainer: {
        width: "100%",
        maxWidth: 420,
        alignItems: "center",
        gap: 8,
    },
    title: {
        fontFamily: FontFamily.display,
        fontSize: 52,
        lineHeight: 51,
        letterSpacing: -1.82,
        color: Colors.ink,
        textAlign: "center",
    },
    subtitle: {
        fontFamily: FontFamily.body,
        fontSize: 17,
        lineHeight: 26,
        letterSpacing: -0.085,
        color: Colors.ink2,
        textAlign: "center",
    },
    primaryButton: {
        width: "100%",
        maxWidth: 420,
        height: 52,
        borderRadius: 26,
        paddingHorizontal: 24,
        backgroundColor: Colors.peach,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: Colors.peach,
        shadowOpacity: 0.35,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
    },
    primaryButtonPressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.92,
    },
    primaryButtonText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 17,
        lineHeight: 22,
        letterSpacing: -0.17,
        color: Colors.surface,
    },
    secondaryActionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    secondaryActionText: {
        fontFamily: FontFamily.body,
        fontSize: 13,
        lineHeight: 20,
        color: Colors.ink2,
    },
    secondaryActionLink: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 13,
        lineHeight: 20,
        color: Colors.peach,
    },
    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    progressActive: {
        width: 40,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.peach,
    },
    progressInactive: {
        width: 8,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.peachSoft,
    },
});
