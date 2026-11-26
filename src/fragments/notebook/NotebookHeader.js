import Subtitle from 'components/Text/Subtitle';
import { Book, ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Pressable } from 'react-native';
import { useTheme } from 'theme/useTheme';

const NotebookHeader = ({
    onPress,
    expanded=true
}) => {
    const { theme } = useTheme();

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
            backgroundColor: theme.colors.primary,
        },
        icon: {
            marginLeft: 'auto'
        }
    });

    return (
        <Pressable 
            style={styles.container}
            onPress={onPress}
        >
            <View style={styles.title}>
                <Book size={24} color={theme.colors.primary} />
                <Subtitle>Notebook (1)</Subtitle>

                {
                    expanded
                        ? <ChevronUp style={styles.icon} />
                        : <ChevronDown style={styles.icon} />
                }
            </View>

            <View style={styles.line}/>

        </Pressable>
    );
};

export default NotebookHeader;