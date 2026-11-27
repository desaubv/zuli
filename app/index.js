import Modal from "components/modal/Modal";
import Button from "components/ui/Button";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import NotificationService from "services/notification";
const { useTheme } = require("theme/useTheme");

export default function HomeScreen() {
    const { theme } = useTheme();

    const [ modal, setModal ] = useState(false);

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
        setModal(true);
        // await NotificationService.scheduleInSeconds(
        //     "Recordatorio",
        //     "No olvides revisar tus pendientes.",
        //     10
        // );
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

            <Modal
                isOpen={modal}
                setIsOpen={setModal}
                onClose={() => console.log("Holap")}
                closeOnBackdropPress
            >
                <View>
                    <Text>Hola</Text>
                </View>
            </Modal>
        </View>
    );
}

