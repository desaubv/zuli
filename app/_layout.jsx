import { useEffect, useState } from "react";
import { Stack } from "expo-router";

import { NavigationItem } from "components/navigation/NavigationBar";
import AppLayout from "components/layout/AppLayout";
import { ActivityIndicator, View } from "react-native";

import { ThemeProvider } from "theme/themeProvider";

import { initializeDatabase } from "database/migrations";
import NotificationService from "services/notification";

import {
    House,
    CircleCheck,
    Calendar,
    UserGroup,
    Pill,
    Notebook
} from "lucide-react-native";
import MainLayout from "components/layout/MainLayout";

export default function RootLayout() {
    const [ready, setReady] = useState(false);

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

    if (!ready) {
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