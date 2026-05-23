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
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Colors, FontFamily, Radius, Shadow } from "../../constants/brand";
import { useAuth } from "../../contexts/AuthContext";
import {
    Course,
    CreateGroupData,
    CreateGroupSchema,
    GroupSetupStackParamList,
    University,
} from "../../types";
import { Ionicons } from "@expo/vector-icons";

const MOCK_UNIVERSITIES: University[] = [
    { id: "univ-usp", name: "Universidade de São Paulo", shortLabel: "USP" },
    { id: "univ-uni", name: "UNICAMP", shortLabel: "UNICAMP" },
    { id: "univ-ufm", name: "UFMG", shortLabel: "UFMG" },
];

const MOCK_COURSES_BY_UNIVERSITY: Record<string, Course[]> = {
    "univ-usp": [
        { id: "6ba7b810-9dad-11d1-80b4-00c04fd430c1", shortLabel: "EDA", name: "Estruturas de Dados Avançadas", teacher: "Dr. Sterling",  location: "Bloco de Engenharia, 402", schedules: [] },
        { id: "6ba7b811-9dad-11d1-80b4-00c04fd430c2", shortLabel: "SO",  name: "Sistemas Operacionais",        teacher: "Dr. Khan",      location: "Laboratório 304",           schedules: [] },
        { id: "6ba7b813-9dad-11d1-80b4-00c04fd430c4", shortLabel: "LP",  name: "Linguagens de Programação",   teacher: "Dr. Hayashi",   location: "Sala 201",                  schedules: [] },
        { id: "6ba7b814-9dad-11d1-80b4-00c04fd430c5", shortLabel: "BD",  name: "Banco de Dados",              teacher: "Prof. Santos",  location: "Laboratório 105",           schedules: [] },
    ],
    "univ-uni": [
        { id: "6ba7b812-9dad-11d1-80b4-00c04fd430c3", shortLabel: "PSI", name: "Psicologia de UI/UX",         teacher: "Prof. Miller",  location: "Lab. de Design B",          schedules: [] },
        { id: "6ba7b813-9dad-11d1-80b4-00c04fd430c4", shortLabel: "LP",  name: "Linguagens de Programação",   teacher: "Dr. Hayashi",   location: "Sala 201",                  schedules: [] },
        { id: "6ba7b814-9dad-11d1-80b4-00c04fd430c5", shortLabel: "BD",  name: "Banco de Dados",              teacher: "Prof. Santos",  location: "Laboratório 105",           schedules: [] },
    ],
    "univ-ufm": [
        { id: "6ba7b810-9dad-11d1-80b4-00c04fd430c1", shortLabel: "EDA", name: "Estruturas de Dados Avançadas", teacher: "Dr. Sterling", location: "Bloco de Engenharia, 402",  schedules: [] },
        { id: "6ba7b812-9dad-11d1-80b4-00c04fd430c3", shortLabel: "PSI", name: "Psicologia de UI/UX",           teacher: "Prof. Miller", location: "Lab. de Design B",          schedules: [] },
        { id: "6ba7b811-9dad-11d1-80b4-00c04fd430c2", shortLabel: "SO",  name: "Sistemas Operacionais",         teacher: "Dr. Khan",     location: "Laboratório 304",           schedules: [] },
    ],
};

const MOCK_GROUP_ID = "00000000-0000-4000-b000-000000000002";

export default function CreateGroupScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<GroupSetupStackParamList>>();
    const { assignGroup } = useAuth();

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<CreateGroupData>({
        resolver: zodResolver(CreateGroupSchema),
        defaultValues: { courseIds: [] },
    });

    const [step, setStep] = useState<1 | 2>(1);
    const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
    const [focusedName, setFocusedName] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const availableCourses = selectedUniversity
        ? (MOCK_COURSES_BY_UNIVERSITY[selectedUniversity.id] ?? [])
        : [];

    const selectedCourses = availableCourses.filter((c) => selectedIds.includes(c.id));

    const handleSelectUniversity = (university: University) => {
        setSelectedUniversity(university);
        setSelectedIds([]);
        setValue("universityId", university.id, { shouldValidate: true });
        setValue("courseIds", [], { shouldValidate: false });
        setStep(2);
    };

    const toggleCourse = (id: string) => {
        const next = selectedIds.includes(id)
            ? selectedIds.filter((x) => x !== id)
            : [...selectedIds, id];
        setSelectedIds(next);
        setValue("courseIds", next, { shouldValidate: true });
    };

    const onSubmit = async (_data: CreateGroupData) => {
        setGlobalError(null);
        setLoading(true);
        try {
            // TODO: call backend to create group, get real groupId
            await assignGroup(MOCK_GROUP_ID);
        } catch {
            setGlobalError("Não foi possível criar o grupo. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const nameBorderColor = errors.name
        ? "#E05A3A"
        : focusedName
        ? Colors.peach
        : Colors.hair;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.blobBottomLeft} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Pressable
                    onPress={() => step === 2 ? setStep(1) : navigation.goBack()}
                    style={styles.backBtn}
                    hitSlop={8}
                >
                    <Text style={styles.backText}>← Voltar</Text>
                </Pressable>

                {step === 1 ? (
                    <>
                        <View style={styles.header}>
                            <Text style={styles.title}>Sua faculdade.</Text>
                            <Text style={styles.subtitle}>Escolha para ver as matérias disponíveis.</Text>
                        </View>

                        <View style={styles.universityList}>
                            {MOCK_UNIVERSITIES.map((univ) => (
                                <Pressable
                                    key={univ.id}
                                    onPress={() => handleSelectUniversity(univ)}
                                    style={({ pressed }) => [
                                        styles.universityCard,
                                        pressed && styles.universityCardPressed,
                                    ]}
                                >
                                    <View style={styles.universityTag}>
                                        <Text style={styles.universityTagText}>{univ.shortLabel}</Text>
                                    </View>
                                    <Text style={styles.universityName}>{univ.name}</Text>
                                    <Text style={styles.universityChevron}>›</Text>
                                </Pressable>
                            ))}
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.header}>
                            <Text style={styles.title}>Monte sua turma.</Text>
                            <View style={styles.breadcrumb}>
                                <Text style={styles.breadcrumbText}>{selectedUniversity?.name}</Text>
                            </View>
                        </View>

                        <View style={styles.form}>
                            {/* Group name */}
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Nome do grupo</Text>
                                        <View style={[styles.inputWrap, { borderColor: nameBorderColor }]}>
                                            <TextInput
                                                style={styles.input}
                                                value={value}
                                                onChangeText={onChange}
                                                onFocus={() => setFocusedName(true)}
                                                onBlur={() => { onBlur(); setFocusedName(false); }}
                                                autoCapitalize="words"
                                                autoCorrect={false}
                                                placeholder="Ex: Turma de Engenharia 2025"
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

                            {/* Course picker */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Matérias</Text>
                                <Pressable
                                    onPress={() => setShowModal(true)}
                                    style={[
                                        styles.inputWrap,
                                        { borderColor: errors.courseIds ? "#E05A3A" : Colors.hair },
                                    ]}
                                    disabled={loading}
                                >
                                    <Text style={[styles.input, selectedIds.length === 0 && styles.placeholder]}>
                                        {selectedIds.length === 0
                                            ? "Selecione as matérias"
                                            : `${selectedIds.length} matéria${selectedIds.length > 1 ? "s" : ""} selecionada${selectedIds.length > 1 ? "s" : ""}`}
                                    </Text>
                                    <Text style={styles.chevron}>›</Text>
                                </Pressable>
                                {errors.courseIds && (
                                    <Text style={styles.fieldError}>{(errors.courseIds as { message?: string }).message}</Text>
                                )}

                                {selectedCourses.length > 0 && (
                                    <View style={styles.chipRow}>
                                        {selectedCourses.map((c) => (
                                            <Pressable
                                                key={c.id}
                                                onPress={() => toggleCourse(c.id)}
                                                style={styles.chip}
                                            >
                                                <Text style={styles.chipText}>{c.shortLabel}</Text>
                                                <Text style={styles.chipRemove}>x</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}
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
                                <Text style={styles.primaryButtonText}>Criar grupo</Text>
                            )}
                        </Pressable>
                    </>
                )}
            </ScrollView>

            <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
                <SafeAreaView style={styles.modalSafe}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Selecione as matérias</Text>
                        <Pressable onPress={() => setShowModal(false)} hitSlop={8}>
                            <Text style={styles.modalClose}>Pronto</Text>
                        </Pressable>
                    </View>
                    <ScrollView contentContainerStyle={styles.modalList}>
                        {availableCourses.map((course) => {
                            const selected = selectedIds.includes(course.id);
                            return (
                                <Pressable
                                    key={course.id}
                                    onPress={() => toggleCourse(course.id)}
                                    style={[styles.courseRow, selected && styles.courseRowSelected]}
                                >
                                    <View style={styles.courseRowLeft}>
                                        <View style={[styles.courseTag, selected && styles.courseTagSelected]}>
                                            <Text style={[styles.courseTagText, selected && styles.courseTagTextSelected]}>
                                                {course.shortLabel}
                                            </Text>
                                        </View>
                                        <View style={styles.courseInfo}>
                                            <Text style={styles.courseName}>{course.name}</Text>
                                            <Text style={styles.courseTeacher}>{course.teacher}</Text>
                                        </View>
                                    </View>
                                    {selected && <Ionicons name="checkmark" size={24} color={Colors.mint} />}
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </SafeAreaView>
            </Modal>
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
    breadcrumb: {
        flexDirection: "row",
        alignItems: "center",
    },
    breadcrumbText: {
        fontFamily: FontFamily.body,
        fontSize: 14,
        lineHeight: 20,
        color: Colors.mint,
    },
    universityList: {
        gap: 12,
    },
    universityCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        padding: 18,
        borderRadius: Radius.card,
        backgroundColor: Colors.surface,
        ...Shadow.e1,
    },
    universityCardPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    universityTag: {
        width: 52,
        height: 52,
        borderRadius: Radius.tile,
        backgroundColor: Colors.mintSoft,
        alignItems: "center",
        justifyContent: "center",
    },
    universityTagText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 13,
        color: Colors.ink,
        letterSpacing: 0.5,
    },
    universityName: {
        flex: 1,
        fontFamily: FontFamily.bodyBold,
        fontSize: 15,
        lineHeight: 20,
        color: Colors.ink,
    },
    universityChevron: {
        fontSize: 22,
        color: Colors.ink3,
        lineHeight: 28,
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
    placeholder: {
        color: Colors.ink3,
    },
    chevron: {
        fontSize: 20,
        color: Colors.ink3,
        lineHeight: 24,
    },
    fieldError: {
        fontFamily: FontFamily.body,
        fontSize: 12,
        lineHeight: 16,
        color: "#E05A3A",
        paddingLeft: 4,
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 4,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: Radius.tile,
        backgroundColor: Colors.mintSoft,
    },
    chipText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 13,
        color: Colors.ink,
    },
    chipRemove: {
        fontFamily: FontFamily.body,
        fontSize: 14,
        color: Colors.ink3,
        lineHeight: 16,
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
    // Modal
    modalSafe: {
        flex: 1,
        backgroundColor: Colors.bg,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.hair,
    },
    modalTitle: {
        fontFamily: FontFamily.display,
        fontSize: 22,
        letterSpacing: -0.02 * 22,
        color: Colors.ink,
    },
    modalClose: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 15,
        color: Colors.peach,
    },
    modalList: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    courseRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: Radius.card,
        backgroundColor: Colors.surface,
        ...Shadow.e1,
    },
    courseRowSelected: {
        backgroundColor: Colors.mintSoft,
    },
    courseRowLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    courseTag: {
        width: 44,
        height: 44,
        borderRadius: Radius.tile,
        backgroundColor: Colors.surface2,
        alignItems: "center",
        justifyContent: "center",
    },
    courseTagSelected: {
        backgroundColor: Colors.mint,
    },
    courseTagText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 11,
        color: Colors.ink2,
        letterSpacing: 0.5,
    },
    courseTagTextSelected: {
        color: Colors.ink,
    },
    courseInfo: {
        flex: 1,
        gap: 2,
    },
    courseName: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 14,
        lineHeight: 18,
        color: Colors.ink,
    },
    courseTeacher: {
        fontFamily: FontFamily.body,
        fontSize: 12,
        lineHeight: 16,
        color: Colors.ink2,
    },
    checkmark: {
        color: Colors.mint,
    },
});
