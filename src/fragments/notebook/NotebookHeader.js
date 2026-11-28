import Subtitle from 'components/Text/Subtitle';
import DynamicIcon from 'components/ui/DynamicIcon';
import { Book, ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Pressable } from 'react-native';
import { useTheme } from 'theme/useTheme';

const NotebookHeader = ({
    notebook,
    onPress,
    onLongPress,
    expanded = true
}) => {
    const { theme } = useTheme();
    const {
        title,
        color,
        icon
    } = notebook;
    const styles = StyleSheet.create({
        container: {
            width: '100%',
            gap: theme.spacing.xs
        },

        title: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
        },

        line: {
            width: '100%',
            height: 3,
            backgroundColor: color ? color : theme.colors.primary,
        },
        icon: {
            marginLeft: 'auto'
        }
    });

    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
            onLongPress={onLongPress}
        >
            <View style={styles.title}>
                <DynamicIcon
                    name={icon}
                    size={24}
                    color={color ? color : theme.colors.primary}
                />
                <Subtitle>{title} ({notebook.notes.length || 0})</Subtitle>

                {
                    expanded
                        ? <ChevronUp style={styles.icon} />
                        : <ChevronDown style={styles.icon} />
                }
            </View>

            <View style={styles.line} />

        </Pressable>
    );
};

export default NotebookHeader;