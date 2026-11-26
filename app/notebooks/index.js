import AppContainer from "components/layout/AppContainer";
import Title from "components/Text/Title";
import Button from "components/ui/Button";
import NotebookRepository from "database/repositories/notebook/notebookRepository";
import NotebookListItem from "fragments/notebook/NotebookListItem";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { useTheme } = require("theme/useTheme");

export default function NotesScreen() {
    const { theme } = useTheme();
    const { width, height } = useWindowDimensions();

    const insets = useSafeAreaInsets();

    const [notebooks, setNotebooks] = useState([]);

    useEffect(() => {
        const getNotebooks = async() => {
            const data = await NotebookRepository.getNotebooks();

            setNotebooks(data);
        }

        getNotebooks();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 24,
        },

        auxText: {
            marginTop: height * 0.25,
            textAlign: "center",
            paddingHorizontal: theme.spacing.md
        },


        floatingButton: {
            position: "absolute",
            zIndex: 20,
            bottom: theme.spacing.md,
            right: theme.spacing.sm,
            width: 50,
            height: 50
        }
    });


    return (
        <View style={{ flex: 1 }}>

            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <AppContainer>

                    <Title>Cuadernos</Title>

                    {notebooks.map((nb, index) =>
                        <NotebookListItem
                            key={"notebook-" + index}
                        />
                    )}

                    {notebooks.length === 0 && (
                        <Text style={styles.auxText}>
                            En este momento no tienes ningún cuaderno,
                            crea uno en el botón de +.
                        </Text>
                    )}

                </AppContainer>
            </ScrollView>

            <Button
                style={styles.floatingButton}
                icon={Plus}
                iconSize={25}
                radius="full"
            />

        </View>
    );
}
