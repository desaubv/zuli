import { Stack } from "expo-router";

import { NavigationItem } from "components/navigation/NavigationBar";
import AppLayout from "components/layout/AppLayout";

import {
    House,
    CircleCheck,
    Calendar,
    UserGroup,
    Pill,
    Notebook
} from "lucide-react-native";
import { useTheme } from "theme/useTheme";

const MainLayout = () => {
    const { theme } = useTheme();
    
    return (
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
                        href="/notebooks"
                        icon={Notebook}
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
                        backgroundColor: theme.colors.background
                    }
                }}
            />

        </AppLayout>
    );
};

export default MainLayout;