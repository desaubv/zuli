
import AppContainer from 'components/layout/AppContainer';
import Header from 'components/navigation/Header';
import Text from 'components/Text/Text';
import Button from 'components/ui/Button';
import NoteRepository from 'database/repositories/note';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Eye, Pencil } from 'lucide-react-native';
import React, { useEffect, useState, useRef } from 'react';
import Markdown from 'react-native-markdown-display';
import {
    View,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    useWindowDimensions,
    ScrollView,
} from 'react-native';
import { formatDate } from 'services/dates';

import { useTheme } from 'theme/useTheme';
import Line from 'components/layout/Line';

const Note = () => {
    const { theme } = useTheme();
    const { edit, id_note } = useLocalSearchParams();
    const { width } = useWindowDimensions();

    const [note, setNote] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [editMode, setEditMode] = useState(edit === "true" ? true : false);

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

    const handleEdit = () => {
        setEditMode(!editMode);
    }

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

        headerTitle: {
            paddingHorizontal: theme.spacing.md,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start"
        },

        editor: {
            flex: 1,
        },

        titleInput: {
            width: isMobile ? undefined : "100%",
            fontSize: 30,
            fontFamily: theme.text.fonts.semibold,
            color: theme.text.primary,
            margin: 0,
            padding: 0
        },

        divider: {
            height: 1,
            marginHorizontal: theme.spacing.md,
            backgroundColor: theme.border?.primary || theme.colors.surface,
        },

        contentInput: {
            paddingHorizontal: theme.spacing.md,
            backgroundColor: theme.colors.surface+"81",
            borderRadius: theme.radius.md,
            flex: 1,
            fontSize: 16,
            lineHeight: 27,
            color: theme.text.primary,
            fontFamily: theme.text.fonts.regular,
            textAlignVertical: 'top',
            paddingVertical: theme.spacing.md,
            outlineStyle: 'none',
            marginHorizontal: theme.spacing.xs
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

    const markdownStyles = {
        body: {
            maxWidth: isMobile ? undefined : "90%",
            paddingHorizontal: theme.spacing.md,

            color: theme.text.primary,
            fontSize: theme.text.baseSize,
            fontFamily: theme.text.fonts.regular,
            lineHeight: 27,
        },

        heading1: {
            fontSize: 25,
            fontFamily: theme.text.fonts.bold,
            color: theme.text.primary,
        },

        heading2: {
            fontSize: 22,
            fontFamily: theme.text.fonts.semibold,
            color: theme.text.primary,
        },

        heading3: {
            fontSize: 18,
            fontFamily: theme.text.fonts.semibold,
            color: theme.text.primary,
        },

        paragraph: {
            marginVertical: 8,
            fontFamily: theme.text.fonts.regular,
        },

        code_inline: {
            backgroundColor: theme.colors.surface,
            borderRadius: 8,
            
            fontFamily: theme.text.fonts.code,
        },

        code_block: {
            backgroundColor: theme.colors.surface,
            borderRadius: 8,
            padding: 12,
            
            fontFamily: theme.text.fonts.code,
        },

        fence: {
            backgroundColor: theme.colors.surface,
            borderRadius: 8,
            padding: 12,
            fontFamily: theme.text.fonts.code,
        },

        blockquote: {
            borderLeftColor: theme.colors.primary,
            borderLeftWidth: 3,
            paddingLeft: 12,
        },

        link: {
            color: theme.colors.secondary,
        },

        hr: {
            marginBottom: theme.spacing.sm,
            marginTop: theme.spacing.md,
            backgroundColor: theme.colors.border,

            height: 2,
        }
    };

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
                    <View style={styles.headerTitle}>

                        {
                            editMode ? (
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
                            ) : (
                                <Text style={styles.titleInput}>{note.title || "Sin título"}</Text>
                            )
                        }
                        <Button
                            style={{ margin: 0 }}
                            icon={editMode ? Eye : Pencil}
                            variant="ghost"
                            iconSize={25}
                            onPress={handleEdit}
                        />
                    </View>

                    <Line
                        width={"99%"}
                        bottom={theme.spacing.sm}
                    />

                    {
                        editMode ? (
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
                        ) : (
                            <ScrollView
                                style={{ flex: 1 }}
                                showsVerticalScrollIndicator={false}
                            >
                                <Markdown
                                    style={markdownStyles}
                                >
                                    {note.content || 'Nota vacía'}
                                </Markdown>
                            </ScrollView>
                        )
                    }

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
