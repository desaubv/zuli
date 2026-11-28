
import AppContainer from 'components/layout/AppContainer';
import Header from 'components/navigation/Header';
import Text from 'components/Text/Text';
import Button from 'components/ui/Button';
import NoteRepository from 'database/repositories/note';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    useWindowDimensions,
} from 'react-native';
import { formatDate } from 'services/dates';

import { useTheme } from 'theme/useTheme';

const Note = () => {
    const { theme } = useTheme();
    const { id_note } = useLocalSearchParams();
    const { width } = useWindowDimensions();

    const [note, setNote] = useState(null);
    const [isDirty, setIsDirty] = useState(false);

    const noteRef = useRef(null);
    const revisionRef = useRef(0);

    const isMobile = width < 768;

    // Cargar nota
    useEffect(() => {
        const getNote = async () => {
            const result = await NoteRepository.getNoteById(id_note);

            noteRef.current = result;
            setNote(result);
        };

        getNote();
    }, [id_note]);

    // Actualizar nota localmente
    const handleChange = (property, value) => {
        const updatedNote = {
            ...noteRef.current,
            [property]: value,
        };

        noteRef.current = updatedNote;
        revisionRef.current++;

        setNote(updatedNote);
        setIsDirty(true);
    };

    // Guardar en SQLite
    const saveNote = async () => {
        const currentNote = noteRef.current;

        if (!currentNote) return;

        const revision = revisionRef.current;

        await NoteRepository.updateNoteById(
            id_note,
            currentNote.title,
            currentNote.content
        );

        // No marcar como guardado si hubo nuevos cambios
        if (revision === revisionRef.current) {
            setIsDirty(false);

            // Actualizar fecha local
            const updated_at = new Date().toISOString()
                .replace('T', ' ')
                .slice(0, 19);

            const updatedNote = {
                ...noteRef.current,
                updated_at,
            };

            noteRef.current = updatedNote;
            setNote(updatedNote);
        }
    };

    // Debounce: guardar después de 2 segundos sin cambios
    useEffect(() => {
        if (!isDirty) return;

        const timeout = setTimeout(() => {
            saveNote().catch(console.error);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [note?.title, note?.content, isDirty]);

    // Salir guardando cambios pendientes
    const handleBack = async () => {
        try {
            if (isDirty) {
                await saveNote();
            }
        } catch (error) {
            console.error('Error guardando nota:', error);
        }

        router.replace('/notebooks');
    };

    const wordCount = note?.content?.trim()
        ? note.content.trim().split(/\s+/).length
        : 0;

    const styles = StyleSheet.create({
        header: {
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
        },

        container: {
            flex: 1,
        },

        editor: {
            flex: 1,
            paddingHorizontal: 24,
        },

        titleInput: {
            fontSize: 30,
            fontFamily: theme.text.fonts.semibold,
            color: theme.text.primary,
        },

        divider: {
            height: 1,
            backgroundColor: theme.border?.primary || theme.colors.surface,
        },

        contentInput: {
            flex: 1,
            fontSize: 16,
            lineHeight: 27,
            color: theme.text.primary,
            fontFamily: theme.text.fonts.regular,
            textAlignVertical: 'top',
            paddingVertical: 12,
            outlineStyle: 'none',
        },

        footer: {
            marginBottom: isMobile ? 0 : theme.spacing.md,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 12,
        },

        counter: {
            fontSize: 12,
            fontFamily: theme.text.fonts.regular,
            color: theme.text.secondary,
        },

        saveText: {
            fontSize: 12,
            fontFamily: theme.text.fonts.semibold,
            color: theme.text.secondary,
            left: -theme.spacing.md,
        }
    });

    return note ? (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Button
                    variant="ghost"
                    icon={ChevronLeft}
                    onPress={handleBack}
                    iconSize={25}
                />
                {
                    isDirty || (
                        <Text style={styles.saveText}>
                            Guardado
                        </Text>
                    )
                }
            </View>

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.editor}>
                    <TextInput
                        style={styles.titleInput}
                        value={note.title}
                        onChangeText={(value) =>
                            handleChange('title', value)
                        }
                        placeholder="Sin título"
                        placeholderTextColor={theme.colors.text.secondary}
                        multiline
                        maxLength={150}
                    />

                    <View style={styles.divider} />

                    <TextInput
                        style={styles.contentInput}
                        value={note.content}
                        onChangeText={(value) =>
                            handleChange('content', value)
                        }
                        placeholder="Comienza a escribir..."
                        placeholderTextColor={theme.colors.text.secondary}
                        multiline
                        textAlignVertical="top"
                        scrollEnabled
                    />

                    <View style={styles.footer}>
                        <Text style={styles.counter}>
                            {isDirty
                                ? 'Cambios pendientes...'
                                : `Última actualización: ${formatDate(note.updated_at)}`}
                        </Text>

                        <Text style={styles.counter}>
                            {wordCount} palabras
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    ) : null;
};

export default Note;
