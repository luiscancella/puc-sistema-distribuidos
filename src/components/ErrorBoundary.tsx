import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import { Colors, FontFamily, Radius } from "../constants/brand";

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        crashlytics().recordError(error);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Algo deu errado</Text>
                <Text style={styles.subtitle}>O erro foi registrado automaticamente.</Text>
                <Pressable
                    style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}
                    onPress={() => this.setState({ hasError: false })}
                >
                    <Text style={styles.btnText}>Tentar novamente</Text>
                </Pressable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        gap: 12,
    },
    title: {
        fontFamily: FontFamily.display,
        fontSize: 28,
        color: Colors.ink,
        letterSpacing: -1,
        textAlign: "center",
    },
    subtitle: {
        fontFamily: FontFamily.body,
        fontSize: 15,
        color: Colors.ink2,
        textAlign: "center",
    },
    btn: {
        marginTop: 8,
        height: 52,
        paddingHorizontal: 32,
        borderRadius: Radius.pill,
        backgroundColor: Colors.ink,
        alignItems: "center",
        justifyContent: "center",
    },
    btnText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: 16,
        color: "#fff",
        letterSpacing: -0.16,
    },
});
