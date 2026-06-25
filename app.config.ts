import { withAndroidManifest, ConfigPlugin } from "@expo/config-plugins";

const withCleartextTraffic: ConfigPlugin = (config) =>
  withAndroidManifest(config, (c) => {
    const app = c.modResults.manifest.application;
    if (app?.[0]) {
      app[0].$["android:usesCleartextTraffic"] = "true";
    }
    return c;
  });

export default {
  expo: {
    name: "Campus Quest",
    slug: "campus-quest",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.campusquest.app",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      googleServicesFile: "./firebase/google-services.json",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      withCleartextTraffic,
      "expo-font",
      "expo-secure-store",
      "expo-notifications",
      [
        "expo-camera",
        {
          cameraPermission: "Permitir que $(PRODUCT_NAME) acesse sua câmera",
          microphonePermission: "Permitir que $(PRODUCT_NAME) acesse seu microfone",
          recordAudioAndroid: false,
          barcodeScannerEnabled: false,
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "fbbdd396-118d-48d8-ae2c-7c35da802682",
      },
    },
  },
};
