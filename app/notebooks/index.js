import ColorPicker from "components/form/ColorPicker";
import Form from "components/form/Form";
import IconPicker from "components/form/IconPicker";
import Input from "components/form/Input";
import useForm from "components/form/useForm";
import AppContainer from "components/layout/AppContainer";
import Modal from "components/modal/Modal";
import Text from "components/Text/Text";
import Title from "components/Text/Title";
import Button from "components/ui/Button";
import NotebookRepository from "database/repositories/notebook/notebookRepository";
import NotebookListItem from "fragments/notebook/NotebookListItem";
import { BookUser, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { useTheme } = require("theme/useTheme");

export default function NotesScreen() {
    const { theme } = useTheme();
    const { width, height } = useWindowDimensions();

    const insets = useSafeAreaInsets();

    const [notebooks, setNotebooks] = useState([]);
    const [newModalOpened, setNewModalOpened] = useState(false);

    const [updateModalOpened, setUpdateModalOpened] = useState(false);
    const [notebookToUpdate, setNotebookToUpdate] = useState(null);

    const getNotebooks = async () => {
        const data = await NotebookRepository.getNotebooks();
        setNotebooks(data);
    }

    useEffect(() => {
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

                    <Title
                        style={{ marginBottom: theme.spacing.md }}
                    >Cuadernos</Title>

                    {notebooks.map((nb) =>
                        <NotebookListItem
                            notebook={nb}
                            key={nb.id_notebook}
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
                onPress={() => setNewModalOpened(true)}
            />
            <NewNoteForm
                onSuccess={getNotebooks}
                modalOpened={newModalOpened}
                setModalOpened={setNewModalOpened}
            />
        </View>
    );
}

const NewNoteForm = ({ modalOpened, setModalOpened, onSuccess }) => {
    const { theme } = useTheme();
    const handleSubmit = async (values) => {
        const { title, color, icon } = values;
        console.log(values);

        try {
            const result = await NotebookRepository.insertNotebook(title, color, icon);
            setModalOpened(false);
            onSuccess();
        } catch (err) {
            console.error(err);
            alert("Ocurrio un error", err);
        }
    }

    const form = useForm({
        initialValues: {
            title: "",
            icon: "Book",
            color: theme.colors.primary
        },
        onSubmit: handleSubmit,
    });

    const styles = StyleSheet.create({
        form: {
            width: "100%",
            paddingHorizontal: theme.spacing.md
        },

        input: {
            marginBottom: theme.spacing.md
        }
    });

    return (
        <Modal
            isOpen={modalOpened}
            setIsOpen={setModalOpened}
            title="Crear nuevo cuaderno"
            onClose={form.reset}
        >
            <Form
                form={form}
                style={styles.form}
            >
                <Input
                    label="Titulo"
                    name="title"
                    placeholder="Ingresa el titulo de tu cuaderno"
                    requiredMessage="Debes ingresar el titulo."
                    required
                    iconLeft={BookUser}

                    bgColor={theme.colors.background}
                    style={styles.input}
                />

                <IconPicker
                    label="Icono"
                    name="icon"

                    bgColor={theme.colors.background}
                    style={styles.input}
                />

                <ColorPicker
                    name="color"
                    label="Color"

                    bgColor={theme.colors.background}
                    style={styles.input}
                />

                <Button
                    style={{marginTop: theme.spacing.lg}}
                    onPress={form.submit}
                >Crear</Button>
            </Form>

        </Modal>
    )
}