import ColorPicker from "components/form/ColorPicker";
import Form from "components/form/Form";
import IconPicker from "components/form/IconPicker";
import Input from "components/form/Input";
import useForm from "components/form/useForm";
import AppContainer from "components/layout/AppContainer";
import Modal from "components/modal/Modal";
import ModalConfirm from "components/modal/ModalConfirm";
import Text from "components/Text/Text";
import Title from "components/Text/Title";
import Button from "components/ui/Button";
import NotebookRepository from "database/repositories/notebook";
import NotebookListItem from "fragments/notebook/NotebookListItem";
import { BookUser, Plus } from "lucide-react-native";
import { useState } from "react";
import { View, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from 'expo-haptics';
import { useTheme } from "theme/useTheme";


export default function NotesScreen() {
    const { theme } = useTheme();
    const { width, height } = useWindowDimensions();

    const insets = useSafeAreaInsets();

    const [notebooks, setNotebooks] = useState([]);
    const [selectedNotebook, setSelectedNotebook] = useState(null);
    const [newModalOpened, setNewModalOpened] = useState(false);

    const getNotebooks = async () => {
        setSelectedNotebook(null);

        const result = await NotebookRepository.getNotebooks();
        const data = result.map((nb) => {
            return {
                ...nb,
                notes: JSON.parse(nb.notes)
            }
        })
        setNotebooks(data);
    }

    useState(() => {
        getNotebooks();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 24,
        },

        listContainer: {
            flexDirection: "column",
            gap: 5
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

                    <View style={styles.listContainer}>
                        {notebooks.map((nb) =>
                            <NotebookListItem
                                handleEdit={() => setSelectedNotebook(nb)}
                                notebook={nb}

                                key={nb.id_notebook}
                            />
                        )}
                    </View>


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
            <EditNotebookModal
                notebook={selectedNotebook}
                modalOpened={selectedNotebook !== null}
                onClose={() => setSelectedNotebook(null)}
                onSuccess={getNotebooks}
            />
        </View>
    );
}

const NewNoteForm = ({ modalOpened, setModalOpened, onSuccess }) => {
    const { theme } = useTheme();

    const handleSubmit = async (values) => {
        const { title, color, icon } = values;

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
            marginBottom: theme.spacing.sm
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

                    style={styles.input}
                />

                <IconPicker
                    label="Icono"
                    name="icon"

                    style={styles.input}
                />

                <ColorPicker
                    name="color"
                    label="Color"

                    style={styles.input}
                />

                <Button
                    style={{ marginTop: theme.spacing.lg }}
                    onPress={form.submit}
                >Crear</Button>
            </Form>

        </Modal>
    )
}

const EditNotebookModal = ({ notebook, modalOpened, onSuccess, onClose }) => {
    if (!notebook) return null;

    useState(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, []);

    const { theme } = useTheme();
    const [confirm, setConfirm] = useState(false);

    const handleDelete = async () => {
        const result = await NotebookRepository.deleteNotebook(notebook.id_notebook);
        onSuccess();
    }

    const handleSubmit = async (values) => {
        const { title, color, icon } = values;

        try {
            const result = await NotebookRepository.updateNotebook(notebook.id_notebook, title, color, icon);
            onSuccess();
        } catch (err) {
            console.error(err);
            alert("Ocurrio un error", err);
        }
    }

    const form = useForm({
        initialValues: notebook,
        onSubmit: handleSubmit,
    });

    const styles = StyleSheet.create({
        form: {
            width: "100%",
            paddingHorizontal: theme.spacing.md
        },

        input: {
            marginBottom: theme.spacing.sm
        }
    });

    return (
        <Modal
            isOpen={modalOpened}
            onClose={onClose}
            title="Editar cuaderno"
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

                    style={styles.input}
                />

                <IconPicker
                    label="Icono"
                    name="icon"

                    style={styles.input}
                />

                <ColorPicker
                    name="color"
                    label="Color"

                    style={styles.input}
                />

                <Button
                    style={{ marginTop: theme.spacing.lg }}
                    onPress={form.submit}
                >Actualizar</Button>


                <Button
                    variant="secondary"
                    style={{ marginTop: theme.spacing.sm }}
                    onPress={() => setConfirm(true)}
                >Eliminar</Button>
            </Form>

            <ModalConfirm
                title="¿Eliminar libro?"
                content={`Estás a punto de eliminar el libro "${notebook.title}" junto con todas las notas que contiene. Esta acción es permanente y no se puede deshacer. ¿Deseas continuar?`}
                isOpen={confirm}
                setIsOpen={setConfirm}
                onConfirm={handleDelete}
            />
        </Modal>
    )
}