import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Colors, FontFamily, Radius, Shadow } from "../../constants/brand";
import { useAuth } from "../../contexts/AuthContext";
import { GroupSetupStackParamList } from "../../types";
import { joinGroup } from "../../services/groups";

const JoinGroupSchema = z.object({
    inviteCode: z.string("Insira o código").min(4, "Código inválido"),
});
type JoinGroupData = z.infer<typeof JoinGroupSchema>;

export default function JoinGroupScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<GroupSetupStackParamList>>();
    const { assignGroup } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<JoinGroupData>({
        resolver: zodResolver(JoinGroupSchema),
    });

    const [focused, setFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const onSubmit = async (data: JoinGroupData) => {
        setGlobalError(null);
        setLoading(true);
        try {
            const { groupId } = await joinGroup(data.inviteCode);
            await assignGroup(groupId);
        } catch {
            setGlobalError("Código inválido ou grupo não encontrado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.blobTopRight} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
                    <Text style={styles.backText}>← Voltar</Text>
                </Pressable>

                <View style={styles.header}>
                    <Text style={styles.title}>Entrar em um grupo.</Text>
                    <Text style={styles.subtitle}>Peça o código para um colega e cole aqui.</Text>
                </View>

                <View style={styles.form}>
                    <Controller
                        control={control}
                        name="inviteCode"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Código do grupo</Text>
                                <View style={[
                                    styles.inputWrap,
                                    { borderColor: errors.inviteCode ? "#E05A3A" : focused ? Colors.peach : Colors.hair },
                                ]}>
                                    <TextInput
                                        style={styles.input}
                                        value={value}
                                        onChangeText={onChange}
                                        onFocus={() => setFocused(true)}
                                        onBlur={() => { onBlur(); setFocused(false); }}
                                        autoCapitalize="characters"
                                        autoCorrect={false}
                                        placeholder="Ex: ABC-1234"
                                        placeholderTextColor={Colors.ink3}
                                        editable={!loading}
                                    />
                                </View>
                                {errors.inviteCode && (
                                    <Text style={styles.fieldError}>{errors.inviteCode.message}</Text>
                                )}
                            </View>
                        )}
                    />
                </View>

                {globalError && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorBannerText}>{globalError}</Text>
                    </View>
                )}

                <Pressable
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        pressed && !loading && styles.primaryButtonPressed,
                        loading && styles.primaryButtonLoading,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color={Colors.surface} size="small" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Entrar</Text>
                    )}
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.bg,
    },
    blobTopRight: {
        position: "absolute",
        top: -60,
        right: -60,
        width: 180,
        height: 180,
        borderRadius: Radius.pill,
        backgroundColor: Colors.peachSoft,
        opacity: 0.7,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 40,
        gap: 32,
    },
    backBtn: {
        alignSelf: "flex-start",
    },
    backText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 14,
        lineHeight: 20,
        color: Colors.ink2,
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
    form: {
        gap: 20,
    },
    fieldGroup: {
        gap: 6,
    },
    label: {
        fontFamily: FontFamily.body,
        fontSize: 13,
        lineHeight: 18,
        letterSpacing: -0.065,
        color: Colors.ink2,
    },
    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        height: 52,
        borderRadius: Radius.pill,
        borderWidth: 1.5,
        backgroundColor: Colors.surface,
        paddingHorizontal: 18,
        ...Shadow.e1,
    },
    input: {
        flex: 1,
        fontFamily: FontFamily.bodyBold,
        fontSize: 18,
        letterSpacing: 2,
        color: Colors.ink,
    },
    fieldError: {
        fontFamily: FontFamily.body,
        fontSize: 12,
        lineHeight: 16,
        color: "#E05A3A",
        paddingLeft: 4,
    },
    errorBanner: {
        backgroundColor: Colors.peachSoft,
        borderRadius: Radius.tile,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    errorBannerText: {
        fontFamily: FontFamily.body,
        fontSize: 14,
        color: "#E05A3A",
        textAlign: "center",
    },
    primaryButton: {
        height: 52,
        borderRadius: Radius.pill,
        backgroundColor: Colors.ink,
        alignItems: "center",
        justifyContent: "center",
        ...Shadow.e2,
    },
    primaryButtonPressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.9,
    },
    primaryButtonLoading: {
        opacity: 0.75,
    },
    primaryButtonText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 17,
        lineHeight: 22,
        letterSpacing: -0.17,
        color: Colors.surface,
    },
});
