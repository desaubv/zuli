import { useEffect, useState } from "react";

import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";

import {
    House,
    CircleCheck,
    Calendar,
    UserGroup,
    Pill,
    NotebookPen
} from "lucide-react-native";
import AppLayout from "components/layout/AppLayout";
import { NavigationItem } from "components/navigation/NavigationBar";

import { initializeDatabase } from "database/migrations";
import NotificationService from "services/notification";

import { ThemeProvider } from "theme/themeProvider";

export default function RootLayout() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        async function initNotifications() {
            NotificationService.initialize();
        }

        async function initDB() {
            try {
                await initializeDatabase();
                setReady(true);
            } catch (error) {
                console.error("Error inicializando SQLite:", error);
            }
        }

        initNotifications();
        initDB();
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
            <AppLayout
                navigation={
                    <>
                        <NavigationItem
                            label="Inicio"
                            href="/"
                            icon={House}
                        />

                        <NavigationItem
                            label="Notas"
                            href="/notes"
                            icon={NotebookPen}
                        />

                        <NavigationItem
                            label="Tareas"
                            href="/tasks"
                            icon={CircleCheck}
                        />

                        <NavigationItem
                            label="Calendario"
                            href="/calendar"
                            icon={Calendar}
                        />

                        <NavigationItem
                            label="Reuniones"
                            href="/meetings"
                            icon={UserGroup}
                        />

                        <NavigationItem
                            label="Medicamentos"
                            href="/medications"
                            icon={Pill}
                        />
                    </>
                }
            >

                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: {
                            backgroundColor: "white"
                        }
                    }}
                />

            </AppLayout>
        </ThemeProvider>
    );
}