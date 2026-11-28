import Line from 'components/layout/Line';
import ModalConfirm from 'components/modal/ModalConfirm';
import Text from 'components/Text/Text';
import NoteRepository from 'database/repositories/note';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDate, localDate } from 'services/dates';
import { useTheme } from 'theme/useTheme';
import * as Haptics from 'expo-haptics';

const NoteItem = ({ note, getNotebooks }) => {
    const { theme } = useTheme();
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const isMobile = width < 768;

    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        if (confirm) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
    }, [confirm]);

    const handleRedirect = () => {
        router.push({
                pathname: "/notebooks/"+note.id_note,
                params: {
                    edit: false
                }
            });
    }

    const handleDelete = async () => {
        const result = await NoteRepository.deleteNote(note.id_note);
        setConfirm(false);
        getNotebooks();
    }

    const styles = StyleSheet.create({
        container: {
            aspectRatio: 4 / 3,
            maxHeight: 250,
            width: isMobile ? '49.5%' : '24.25%',
            marginVertical: theme.spacing.xs / 2,

            padding: theme.spacing.md,
            paddingBottom: 0,

            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            borderWidth: 1,
        },

        footer: {
            justifyContent: 'flex-end',
            marginTop: "auto",
            marginBottom: theme.spacing.sm,
        },

        footerText: {
            backgroundColor: "red",
            fontSize: 10
        }
    });

    return note ? (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={handleRedirect}
                onLongPress={() => setConfirm(true)}
            >
                <Text font="bold">{note.title || "Sin título"}</Text>
                <Line
                    bottom={theme.spacing.sm}
                    top={theme.spacing.xs}
                />
                <Text
                    variant="secondary"
                    numberOfLines={3}
                >
                    {note.content || "Nota vacía"}
                </Text>

                <View style={styles.footer}>
                    <Text variant="secondary" style={{ alignSelf: "end", fontSize: 12 }}>{formatDate(note.updated_at)}</Text>
                </View>
            </TouchableOpacity>
            <ModalConfirm
                isOpen={confirm}
                setIsOpen={setConfirm}
                title="¿Eliminar nota?"
                content={`Estás a punto de eliminar la nota "${note.title || "Sin título"}". Esta acción es permanente y no se puede deshacer. ¿Deseas continuar?`}
                onConfirm={handleDelete}
            />
        </>
    ) : null;
};

export default NoteItem;