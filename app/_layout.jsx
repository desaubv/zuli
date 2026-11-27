import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { ThemeProvider } from "theme/themeProvider";

import { initializeDatabase } from "database/migrations";
import NotificationService from "services/notification";

import MainLayout from "components/layout/MainLayout";
import { Outfit_100Thin, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold, useFonts } from "@expo-google-fonts/outfit";

export default function RootLayout() {
    const [ready, setReady] = useState(false);

    const [fontsLoaded] = useFonts({
        "Outfil-Thin":      Outfit_100Thin,
        "Outfil-Regular":   Outfit_400Regular,
        "Outfil-Medium":    Outfit_500Medium,
        "Outfil-SemiBold":  Outfit_600SemiBold,
        "Outfil-Bold":      Outfit_700Bold,
        "Outfil-ExtraBold": Outfit_800ExtraBold,
    })

    useEffect(() => {
        async function initializeDB() {
            try {
                await initializeDatabase();
                setReady(true);
            } catch (error) {
                console.error("Error inicializando SQLite:", error);
            }
        }

        async function initializeNotifications() {
            NotificationService.initialize();
        }

        initializeDB();
        initializeNotifications();
    }, []);

    if (!ready || !fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <ThemeProvider>
            <MainLayout/>
        </ThemeProvider>
    );
}