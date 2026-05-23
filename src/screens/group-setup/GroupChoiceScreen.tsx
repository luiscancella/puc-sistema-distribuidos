import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { Colors, FontFamily, Radius, Shadow } from "../../constants/brand";
import { useAuth } from "../../contexts/AuthContext";
import { GroupSetupStackParamList } from "../../types";
import { Ionicons } from "@expo/vector-icons";

export default function GroupChoiceScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<GroupSetupStackParamList>>();
    const { signOut } = useAuth();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.blobBottomLeft} />

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Escolha como entrar.</Text>
                    <Text style={styles.subtitle}>Você precisa de um grupo para usar o app.</Text>
                </View>

                <View style={styles.cards}>
                    <Pressable
                        onPress={() => navigation.navigate("CreateGroup")}
                        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                    >
                        <View style={[styles.cardIcon, { backgroundColor: Colors.mintSoft }]}>
                            <Text style={styles.cardIconText}>👥</Text>
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Criar um grupo</Text>
                            <Text style={styles.cardDesc}>Monte a sua turma e convide colegas.</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={Colors.ink3} />
                    </Pressable>

                    <Pressable
                        onPress={() => navigation.navigate("JoinGroup")}
                        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                    >
                        <View style={[styles.cardIcon, { backgroundColor: Colors.peachSoft }]}>
                            <Text style={styles.cardIconText}>🔑</Text>
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Entrar com código</Text>
                            <Text style={styles.cardDesc}>Use o código de convite de um colega.</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={Colors.ink3} />
                    </Pressable>
                </View>

                <Pressable onPress={signOut} hitSlop={8} style={styles.exitBtn}>
                    <Text style={styles.exitText}><Ionicons name="arrow-back" size={22} color={Colors.ink3} /> Sair</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.bg,
    },
    blobBottomLeft: {
        position: "absolute",
        bottom: -60,
        left: -60,
        width: 200,
        height: 200,
        borderRadius: Radius.pill,
        backgroundColor: Colors.mintSoft,
        opacity: 0.7,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 40,
        gap: 40,
    },
    header: {
        gap: 8,
    },
    title: {
        fontFamily: FontFamily.display,
        fontSize: 40,
        lineHeight: 40,
        letterSpacing: -1.4,
        color: Colors.ink,
    },
    subtitle: {
        fontFamily: FontFamily.body,
        fontSize: 15,
        lineHeight: 22,
        letterSpacing: -0.075,
        color: Colors.ink2,
    },
    cards: {
        gap: 16,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        padding: 20,
        borderRadius: Radius.card,
        backgroundColor: Colors.surface,
        ...Shadow.e1,
    },
    cardPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    cardIcon: {
        width: 48,
        height: 48,
        borderRadius: Radius.tile,
        alignItems: "center",
        justifyContent: "center",
    },
    cardIconText: {
        fontSize: 22,
    },
    cardBody: {
        flex: 1,
        gap: 2,
    },
    cardTitle: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 16,
        lineHeight: 22,
        color: Colors.ink,
    },
    cardDesc: {
        fontFamily: FontFamily.body,
        fontSize: 13,
        lineHeight: 18,
        color: Colors.ink2,
    },
    exitBtn: {
        alignSelf: "center",
    },
    exitText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 14,
        lineHeight: 20,
        color: Colors.ink3,
    },
});
