import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'theme/useTheme';
import NotebookHeader from './NotebookHeader';
import NoteItem from './NoteItem';
import NewNoteItem from './NewNoteItem';

const NotebookListItem = ({ notebook, handleEdit }) => {
    const { theme } = useTheme();
    const [expanded, setExpanded] = useState(true);

    console.log(notebook.notes)

    const styles = StyleSheet.create({

        container: {
            width: '100%',
            paddingBottom: theme.spacing.md
        },

        items: {
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            columnGap: '1%',
            rowGap: theme.spacing.sm,
        }
    });
    return (
        <View style={styles.container}>
            <NotebookHeader
                notebook={notebook}
                onPress={() => setExpanded((prev) => !prev)}
                onLongPress={handleEdit}
                expanded={expanded}
            />

            {
                expanded ? (
                    <View style={styles.items}>
                        {
                            notebook.notes.map((note, index) => 
                                <NoteItem
                                    note={note}
                                    key={"note-"+index}
                                />
                            )
                        }

                        <NewNoteItem
                            idNotebook={notebook.id_notebook}
                        />

                    </View>
                ) : null
            }

        </View>
    );
};

export default NotebookListItem;