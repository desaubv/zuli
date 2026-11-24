import Button from "components/ui/Button";
import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import NotificationService from "services/notification";
const { useTheme } = require("theme/useTheme");

export default function HomeScreen() {
    const { theme } = useTheme();

    useEffect(() => {
        NotificationService.initialize();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 24,
        },

        title: {
            fontSize: 28,
            fontWeight: "bold",
        }
    });

    const notification = async () => {
        await NotificationService.scheduleInSeconds(
            "Recordatorio",
            "No olvides revisar tus pendientes.",
            10
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Inicio
            </Text>

            <Text>
                Bienvenido a mi aplicación.
            </Text>

            <Button onPress={notification}>Ola</Button>
        </View>
    );
}

