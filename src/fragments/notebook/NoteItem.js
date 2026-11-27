import Line from 'components/layout/Line';
import Text from 'components/Text/Text';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'theme/useTheme';

const NoteItem = () => {
    const { theme } = useTheme();
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const isMobile = width < 768;

    const styles = StyleSheet.create({
        container: {
            width: isMobile ? "49.5%" : "24.5%",

            marginVertical: theme.spacing.xs,

            padding: theme.spacing.md,
            paddingBottom: 0,

            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            borderWidth: 1,
        },

        footer: {
            justifyContent: 'flex-end',
            marginTop: theme.spacing.sm,
            marginBottom: theme.spacing.sm,
        },

        footerText: {
            backgroundColor: "red",
            fontSize: 10
        }
    });

    return (
        <View style={styles.container}>
            <Text font="bold">Titulo</Text>
            <Line
                bottom={theme.spacing.sm}
                top={theme.spacing.xs}
            />
            <Text variant="secondary" numberOfLines={3}>
                lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>

            <View style={styles.footer}>
                <Text variant="secondary" style={{ alignSelf: "end", fontSize: 12 }}>Lun. 13:45</Text>
            </View>
        </View>
    );
};

export default NoteItem;