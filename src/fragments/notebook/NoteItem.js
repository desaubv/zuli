import Line from 'components/layout/Line';
import Text from 'components/Text/Text';
import React from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDate, localDate } from 'services/dates';
import { useTheme } from 'theme/useTheme';

const NoteItem = ({note}) => {
    const { theme } = useTheme();
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const isMobile = width < 768;

    const styles = StyleSheet.create({
        container: {
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

    return (
        <TouchableOpacity style={styles.container}>
            <Text font="bold">{note.title}</Text>
            <Line
                bottom={theme.spacing.sm}
                top={theme.spacing.xs}
            />
            <Text variant="secondary" numberOfLines={3}>
                {note.content || "Nota vacía"}
            </Text>

            <View style={styles.footer}>
                <Text variant="secondary" style={{ alignSelf: "end", fontSize: 12}}>{formatDate(note.updated_at)}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default NoteItem;