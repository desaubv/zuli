import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'theme/useTheme';
import NotebookHeader from './NotebookHeader';
import NoteItem from './NoteItem';

const NotebookListItem = () => {
    const { theme } = useTheme();
    const [expanded, setExpanded] = useState(true);

    const styles = StyleSheet.create({
        
        container: {
            width: '100%',
            marginBottom: theme.spacing.md
        },

        items: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: "flex-start",
            flexWrap: 'wrap',
            gap: `0.5%`
        }
    });
    return (
        <View style={styles.container}>
            <NotebookHeader
                onPress={() => setExpanded((prev) => !prev)}
                expanded={expanded}
            />

            {
                expanded ? (
                    <View style={styles.items}>
                        <NoteItem />
                        <NoteItem />
                        <NoteItem />
                        <NoteItem />
                        <NoteItem />
                        <NoteItem />
                        <NoteItem />
                    </View>
                ) : null
            }

        </View>
    );
};

export default NotebookListItem;