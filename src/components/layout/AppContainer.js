import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'theme/useTheme';

const AppContainer = ({ children, style }) => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 24,
        },
    });
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
};

export default AppContainer;