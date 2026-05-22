import { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Colors, FontFamily, Radius, Shadow } from "../../constants/brand";
import { useAuth } from "../../contexts/AuthContext";
import { Course, OnboardingStackParamList, SignUpData, SignUpSchema, University } from "../../types";

const MOCK_UNIVERSITIES: University[] = [
    { id: "550e8400-e29b-41d4-a716-446655440001", name: "Universidade de São Paulo", shortLabel: "USP" },
    { id: "550e8400-e29b-41d4-a716-446655440002", name: "Universidade Estadual de Campinas", shortLabel: "UNICAMP" },
    { id: "550e8400-e29b-41d4-a716-446655440003", name: "Pontifícia Universidade Católica", shortLabel: "PUC" },
    { id: "550e8400-e29b-41d4-a716-446655440004", name: "Universidade Federal de Minas Gerais", shortLabel: "UFMG" },
];

const MOCK_COURSES: Course[] = [
    { id: "6ba7b810-9dad-11d1-80b4-00c04fd430c1", shortLabel: "EDA", name: "Estruturas de Dados Avançadas", teacher: "Dr. Sterling", location: "Bloco de Engenharia, 402", schedules: [] },
    { id: "6ba7b811-9dad-11d1-80b4-00c04fd430c2", shortLabel: "SO",  name: "Sistemas Operacionais",        teacher: "Dr. Khan",     location: "Laboratório 304",      schedules: [] },
    { id: "6ba7b812-9dad-11d1-80b4-00c04fd430c3", shortLabel: "PSI", name: "Psicologia de UI/UX",          teacher: "Prof. Miller", location: "Lab. de Design B",     schedules: [] },
    { id: "6ba7b813-9dad-11d1-80b4-00c04fd430c4", shortLabel: "LP",  name: "Linguagens de Programação",    teacher: "Dr. Hayashi",  location: "Sala 201",             schedules: [] },
    { id: "6ba7b814-9dad-11d1-80b4-00c04fd430c5", shortLabel: "BD",  name: "Banco de Dados",               teacher: "Prof. Santos", location: "Laboratório 105",      schedules: [] },
];

type RegisterField = keyof SignUpData;

export default function RegisterScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
    const { signUp } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<SignUpData>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            courseIds: [],
        },
    });

    const [focusedField, setFocusedField] = useState<RegisterField | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showUniversityModal, setShowUniversityModal] = useState(false);
    const [showCoursesModal, setShowCoursesModal] = useState(false);

    const getBorderColor = (field: RegisterField) => {
        if (errors[field]) return "#E05A3A";
        if (focusedField === field) return Colors.peach;
        return Colors.hair;
    };

    const onSubmit = async (data: SignUpData) => {
        setGlobalError(null);
        setLoading(true);
        try {
            console.log("Submitting sign-up data:", data);
            // await signUp(data);
        } catch (error) {
            console.error("Sign-up error:", error);
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
                                        editable={!loading}
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
                                        editable={!loading}
                                    />
                                </View>
                                {errors.email && (
                                    <Text style={styles.fieldError}>{errors.email.message}</Text>
                                )}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="universityId"
                        render={({ field: { value, onChange } }) => (
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Universidade</Text>
                                <Pressable
                                    style={[styles.inputWrap, {
                                        borderColor: errors.universityId
                                            ? "#E05A3A"
                                            : showUniversityModal ? Colors.peach : Colors.hair,
                                    }]}
                                    onPress={() => !loading && setShowUniversityModal(true)}
                                >
                                    <Text
                                        style={[styles.input, !value && { color: Colors.ink3 }]}
                                        numberOfLines={1}
                                    >
                                        {MOCK_UNIVERSITIES.find(u => u.id === value)?.name ?? "Selecione sua universidade"}
                                    </Text>
                                    <Ionicons name="chevron-down" size={18} color={Colors.ink3} />
                                </Pressable>
                                {errors.universityId && (
                                    <Text style={styles.fieldError}>{errors.universityId.message}</Text>
                                )}

                                <Modal
                                    visible={showUniversityModal}
                                    transparent
                                    animationType="slide"
                                    onRequestClose={() => setShowUniversityModal(false)}
                                >
                                    <Pressable style={styles.modalOverlay} onPress={() => setShowUniversityModal(false)}>
                                        <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
                                            <Text style={styles.modalTitle}>Universidade</Text>
                                            {MOCK_UNIVERSITIES.map(item => (
                                                <Pressable
                                                    key={item.id}
                                                    style={styles.modalItem}
                                                    onPress={() => {
                                                        onChange(item.id);
                                                        setShowUniversityModal(false);
                                                    }}
                                                >
                                                    <View style={styles.modalItemBody}>
                                                        {item.shortLabel && (
                                                            <View style={styles.modalBadge}>
                                                                <Text style={styles.modalBadgeText}>{item.shortLabel}</Text>
                                                            </View>
                                                        )}
                                                        <Text style={styles.modalItemName} numberOfLines={1}>{item.name}</Text>
                                                    </View>
                                                    {value === item.id && (
                                                        <Ionicons name="checkmark" size={20} color={Colors.peach} />
                                                    )}
                                                </Pressable>
                                            ))}
                                        </View>
                                    </Pressable>
                                </Modal>
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="courseIds"
                        render={({ field: { value = [], onChange } }) => {
                            const selectedLabels = MOCK_COURSES
                                .filter(c => value.includes(c.id))
                                .map(c => c.shortLabel)
                                .join(", ");

                            return (
                                <View style={styles.fieldGroup}>
                                    <Text style={styles.label}>Disciplinas</Text>
                                    <Pressable
                                        style={[styles.inputWrap, {
                                            borderColor: errors.courseIds
                                                ? "#E05A3A"
                                                : showCoursesModal ? Colors.peach : Colors.hair,
                                        }]}
                                        onPress={() => !loading && setShowCoursesModal(true)}
                                    >
                                        <Text
                                            style={[styles.input, value.length === 0 && { color: Colors.ink3 }]}
                                            numberOfLines={1}
                                        >
                                            {selectedLabels || "Selecione suas disciplinas"}
                                        </Text>
                                        <Ionicons name="chevron-down" size={18} color={Colors.ink3} />
                                    </Pressable>
                                    {errors.courseIds && (
                                        <Text style={styles.fieldError}>{errors.courseIds.message}</Text>
                                    )}

                                    <Modal
                                        visible={showCoursesModal}
                                        transparent
                                        animationType="slide"
                                        onRequestClose={() => setShowCoursesModal(false)}
                                    >
                                        <Pressable style={styles.modalOverlay} onPress={() => setShowCoursesModal(false)}>
                                            <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
                                                <Text style={styles.modalTitle}>Disciplinas</Text>
                                                {MOCK_COURSES.map(item => {
                                                    const isSelected = value.includes(item.id);
                                                    return (
                                                        <Pressable
                                                            key={item.id}
                                                            style={styles.modalItem}
                                                            onPress={() => {
                                                                onChange(
                                                                    isSelected
                                                                        ? value.filter(id => id !== item.id)
                                                                        : [...value, item.id],
                                                                );
                                                            }}
                                                        >
                                                            <View style={styles.modalItemBody}>
                                                                <View style={styles.modalBadge}>
                                                                    <Text style={styles.modalBadgeText}>{item.shortLabel}</Text>
                                                                </View>
                                                                <Text style={styles.modalItemName} numberOfLines={1}>{item.name}</Text>
                                                            </View>
                                                            <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                                                                {isSelected && <Ionicons name="checkmark" size={14} color={Colors.surface} />}
                                                            </View>
                                                        </Pressable>
                                                    );
                                                })}
                                                <Pressable
                                                    style={styles.modalConfirmBtn}
                                                    onPress={() => setShowCoursesModal(false)}
                                                >
                                                    <Text style={styles.modalConfirmBtnText}>Confirmar seleção</Text>
                                                </Pressable>
                                            </View>
                                        </Pressable>
                                    </Modal>
                                </View>
                            );
                        }}
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
                                            editable={!loading}
                                        />
                                        <Pressable onPress={() => setShowConfirmPassword((v) => !v)} style={styles.eyeBtn} hitSlop={8}>
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
                        <Text style={styles.primaryButtonText}>Criar conta</Text>
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
    passwordRow: {
        flexDirection: "row",
        gap: 12,
    },
    passwordCol: {
        flex: 1,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    modalSheet: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 24,
        paddingBottom: 36,
        paddingHorizontal: 20,
        gap: 2,
    },
    modalTitle: {
        fontFamily: FontFamily.display,
        fontSize: 20,
        lineHeight: 26,
        letterSpacing: -0.6,
        color: Colors.ink,
        marginBottom: 10,
    },
    modalItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.hair,
    },
    modalItemBody: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
        marginRight: 10,
    },
    modalBadge: {
        backgroundColor: Colors.peachSoft,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    modalBadgeText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 11,
        color: Colors.peach,
    },
    modalItemName: {
        fontFamily: FontFamily.body,
        fontSize: 15,
        color: Colors.ink,
        flex: 1,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: Colors.hair,
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxActive: {
        backgroundColor: Colors.peach,
        borderColor: Colors.peach,
    },
    modalConfirmBtn: {
        marginTop: 16,
        height: 52,
        borderRadius: Radius.pill,
        backgroundColor: Colors.ink,
        alignItems: "center",
        justifyContent: "center",
        ...Shadow.e1,
    },
    modalConfirmBtnText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.2,
        color: Colors.surface,
    },
});
