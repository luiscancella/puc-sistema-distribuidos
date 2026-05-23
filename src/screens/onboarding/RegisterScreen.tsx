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
import { useAuth } from "../../contexts/AuthContext";
import { OnboardingStackParamList, SignUpData, SignUpSchema } from "../../types";

type RegisterField = keyof SignUpData;

export default function RegisterScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { signUp } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<SignUpData>({
        resolver: zodResolver(SignUpSchema),
    });

    const [focusedField, setFocusedField] = useState<RegisterField | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const getBorderColor = (field: RegisterField) => {
        if (errors[field]) return "#E05A3A";
        if (focusedField === field) return Colors.peach;
        return Colors.hair;
    };

    const onSubmit = async (data: SignUpData) => {
        setGlobalError(null);
        setLoading(true);
        try {
            await signUp(data);
        } catch {
            setGlobalError("Não foi possível criar a conta. Tente novamente.");
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
                    <Text style={styles.title}>Crie sua conta.</Text>
                    <Text style={styles.subtitle}>Um formulário rápido. Depois é só competir.</Text>
                </View>

                <View style={styles.form}>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Nome completo</Text>
                                <View style={[styles.inputWrap, { borderColor: getBorderColor("name") }]}>
                                    <TextInput
                                        style={styles.input}
                                        value={value}
                                        onChangeText={onChange}
                                        onFocus={() => setFocusedField("name")}
                                        onBlur={() => { onBlur(); setFocusedField(null); }}
                                        autoCapitalize="words"
                                        autoCorrect={false}
                                        placeholder="Fulano da Silva"
                                        placeholderTextColor={Colors.ink3}
                                    />
                                </View>
                                {errors.name && (
                                    <Text style={styles.fieldError}>{errors.name.message}</Text>
                                )}
                            </View>
                        )}
                    />

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
                                        placeholder="fulano@uni.edu"
                                        placeholderTextColor={Colors.ink3}
                                    />
                                </View>
                                {errors.email && (
                                    <Text style={styles.fieldError}>{errors.email.message}</Text>
                                )}
                            </View>
                        )}
                    />

                    <View style={styles.passwordRow}>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={[styles.fieldGroup, styles.passwordCol]}>
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
                                        />
                                        <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                                            <Text style={styles.eyeText}>{showPassword ? "Ocultar" : "Mostrar"}</Text>
                                        </Pressable>
                                    </View>
                                    {errors.password && (
                                        <Text style={styles.fieldError}>{errors.password.message}</Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={[styles.fieldGroup, styles.passwordCol]}>
                                    <Text style={styles.label}>Confirmar</Text>
                                    <View style={[styles.inputWrap, { borderColor: getBorderColor("confirmPassword") }]}>
                                        <TextInput
                                            style={[styles.input, styles.inputFlex]}
                                            value={value}
                                            onChangeText={onChange}
                                            onFocus={() => setFocusedField("confirmPassword")}
                                            onBlur={() => { onBlur(); setFocusedField(null); }}
                                            secureTextEntry={!showConfirmPassword}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            placeholder="••••••••"
                                            placeholderTextColor={Colors.ink3}
                                        />
                                        <Pressable onPress={() => setShowConfirmPassword((v) => !v)} hitSlop={8}>
                                            <Text style={styles.eyeText}>{showConfirmPassword ? "Ocultar" : "Mostrar"}</Text>
                                        </Pressable>
                                    </View>
                                    {errors.confirmPassword && (
                                        <Text style={styles.fieldError}>{errors.confirmPassword.message}</Text>
                                    )}
                                </View>
                            )}
                        />
                    </View>
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
                        <Text style={styles.primaryButtonText}>Continuar</Text>
                    )}
                </Pressable>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Já tem uma conta? </Text>
                    <Pressable onPress={() => navigation.navigate("Login")} hitSlop={8}>
                        <Text style={styles.footerLink}>Entrar</Text>
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
        fontFamily: FontFamily.body,
        fontSize: 15,
        lineHeight: 20,
        color: Colors.ink,
    },
    inputFlex: {
        flex: 1,
    },
    eyeText: {
        fontFamily: FontFamily.body,
        fontSize: 12,
        color: Colors.ink3,
        paddingLeft: 8,
    },
    fieldError: {
        fontFamily: FontFamily.body,
        fontSize: 12,
        lineHeight: 16,
        color: "#E05A3A",
        paddingLeft: 4,
    },
    passwordRow: {
        flexDirection: "row",
        gap: 12,
    },
    passwordCol: {
        flex: 1,
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
});
