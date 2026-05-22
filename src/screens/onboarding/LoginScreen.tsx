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

import { Colors, FontFamily, Radius, Shadow } from "../../constants/brand";
import LogoMark from "../../components/LogoMark";
import { useAuth } from "../../contexts/AuthContext";
import { OnboardingStackParamList, SignInData, SignInSchema } from "../../types";

type LoginField = keyof SignInData;

export default function LoginScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { signIn } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<SignInData>({
        resolver: zodResolver(SignInSchema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<LoginField | null>(null);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const getBorderColor = (field: LoginField) => {
        if (errors[field]) return "#E05A3A";
        if (focusedField === field) return Colors.peach;
        return Colors.hair;
    };

    const onSubmit = async (data: SignInData) => {
        setGlobalError(null);
        setLoading(true);
        try {
            console.log("Form data:", data);
            // await signIn(data);
        } catch {
            console.info("Login failed");
            setGlobalError("Credenciais inválidas. Tente novamente.");
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
                <View style={styles.logoWrap}>
                    <LogoMark size={48} />
                </View>

                <View style={styles.header}>
                    <Text style={styles.title}>Bem-vindo de volta.</Text>
                    <Text style={styles.subtitle}>Hora de defender sua sequência.</Text>
                </View>

                <View style={styles.form}>
                    {/* Email */}
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>E-mail universitário</Text>
                                <View style={[styles.inputWrap, { borderColor: getBorderColor("email") }]}>
                                    <TextInput
                                        style={styles.input}
                                        value={value}
                                        onChangeText={onChange}
                                        onFocus={() => setFocusedField("email")}
                                        onBlur={() => { onBlur(); setFocusedField(null); }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholder="seu@email.edu"
                                        placeholderTextColor={Colors.ink3}
                                        editable={!loading}
                                    />
                                </View>
                                {errors.email && (
                                    <Text style={styles.fieldError}>{errors.email.message}</Text>
                                )}
                            </View>
                        )}
                    />

                    {/* Password */}
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Senha</Text>
                                <View style={[styles.inputWrap, { borderColor: getBorderColor("password") }]}>
                                    <TextInput
                                        style={[styles.input, styles.inputFlex]}
                                        value={value}
                                        onChangeText={onChange}
                                        onFocus={() => setFocusedField("password")}
                                        onBlur={() => { onBlur(); setFocusedField(null); }}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholder="••••••••"
                                        placeholderTextColor={Colors.ink3}
                                        editable={!loading}
                                    />
                                    <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn} hitSlop={8}>
                                        <Text style={styles.eyeText}>{showPassword ? "Ocultar" : "Mostrar"}</Text>
                                    </Pressable>
                                </View>
                                {errors.password && (
                                    <Text style={styles.fieldError}>{errors.password.message}</Text>
                                )}
                            </View>
                        )}
                    />

                    <Pressable style={styles.forgotWrap} hitSlop={8}>
                        <Text style={styles.forgotText}>Esqueceu a senha?</Text>
                    </Pressable>
                </View>

                {globalError && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorBannerText}>{globalError}</Text>
                    </View>
                )}

                {/* Primary button */}
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

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Novo por aqui? </Text>
                    <Pressable onPress={() => navigation.replace("Register")} hitSlop={8}>
                        <Text style={styles.footerLink}>Criar uma conta</Text>
                    </Pressable>
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
    logoWrap: {
        alignSelf: "flex-start",
    },
    header: {
        gap: 8,
    },
    title: {
        fontFamily: FontFamily.display,
        fontSize: 52,
        lineHeight: 51,
        letterSpacing: -1.82,
        color: Colors.ink,
    },
    subtitle: {
        fontFamily: FontFamily.body,
        fontSize: 17,
        lineHeight: 26,
        letterSpacing: -0.085,
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
        borderRadius: 26,
        borderWidth: 1.5,
        backgroundColor: Colors.surface,
        paddingHorizontal: 18,
        ...Shadow.e1,
    },
    input: {
        flex: 1,
        fontFamily: FontFamily.body,
        fontSize: 15,
        lineHeight: 20,
        color: Colors.ink,
    },
    inputFlex: {
        flex: 1,
    },
    eyeBtn: {
        paddingLeft: 8,
    },
    eyeText: {
        fontFamily: FontFamily.body,
        fontSize: 12,
        color: Colors.ink3,
    },
    fieldError: {
        fontFamily: FontFamily.body,
        fontSize: 12,
        lineHeight: 16,
        color: "#E05A3A",
        paddingLeft: 4,
    },
    forgotWrap: {
        alignSelf: "flex-end",
    },
    forgotText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 13,
        lineHeight: 20,
        letterSpacing: -0.065,
        color: Colors.peach,
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
        borderRadius: 26,
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
    footerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    footerText: {
        fontFamily: FontFamily.body,
        fontSize: 13,
        lineHeight: 20,
        color: Colors.ink2,
    },
    footerLink: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 13,
        lineHeight: 20,
        color: Colors.peach,
    },
});
