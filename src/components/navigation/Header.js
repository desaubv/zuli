import Title from 'components/Text/Title';
import Button from 'components/ui/Button';
import { router, useTheme } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Header = ({ title, handleBack }) => {
    const { theme } = useTheme();

    const onBack = () => {
        router.back();
    }

    const styles = StyleSheet.create({
        header: {
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            gap: "5"
        }
    })
    return (
        <View style={styles.container}>
            <Button 
                variant="ghost"
                icon={ChevronLeft}
                onPress={handleBack || onBack}
                iconSize={25}
            />
            <Title>{title}</Title>
        </View>
    );
};

export default Header;