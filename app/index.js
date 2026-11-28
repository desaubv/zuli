import Modal from "components/modal/Modal";
import Subtitle from "components/Text/Subtitle";
import Text from "components/Text/Text";
import Title from "components/Text/Title";
import Button from "components/ui/Button";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import NotificationService from "services/notification";
const { useTheme } = require("theme/useTheme");

export default function HomeScreen() {
    const { theme } = useTheme();

    const [ modal, setModal ] = useState(false);

    useEffect(() => {
        router.replace("/notebooks")
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 24,
        },
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
            <Title
            >Holap</Title>

            <Subtitle>Wwebi wabo</Subtitle>

            <Text style={styles.title}>
                Inicio
            </Text>

            <Text>
                Bienvenido a mi aplicación.
            </Text>
           <Text
            variant="secondary"
           >
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

