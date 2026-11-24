import { Stack } from "expo-router";

import AppLayout from "components/layout/AppLayout";

import {
    House,
    CircleCheck,
    Calendar,
    UserGroup,
    Pill,
    NotebookPen
} from "lucide-react-native";
import { NavigationItem } from "components/navigation/NavigationBar";
import { ThemeProvider } from "theme/themeProvider";
import { useEffect } from "react";
import NotificationService from "services/notification";

export default function RootLayout() {

    useEffect(() => {
        NotificationService.initialize();
    }, []);

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
                        headerShown: false
                    }}
                />

            </AppLayout>
        </ThemeProvider>
    );
}