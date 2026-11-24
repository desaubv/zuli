import { Stack, useRouter } from "expo-router";
import { ThemeProvider } from "theme/themeProvider";

export default function RootLayout() {
    const router = useRouter();

    return (
        <ThemeProvider>
            <Stack
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen
                    name="index"
                />

            </Stack>
        </ThemeProvider>
    );
}