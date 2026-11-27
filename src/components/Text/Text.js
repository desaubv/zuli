import React from "react";
import {
    Text as RNText,
    View,
    StyleSheet,
} from "react-native";

import { useTheme } from "theme/useTheme";
import SkeletonText from "../sketeton/SkeletonText";

const Text = ({
    children,
    variant = "primary",
    font = "default",
    style,
    loading = false,
    ellipsizeMode = "tail",
    numberOfLines,
    skeletonWidth = "100%",
    ...props
}) => {
    const { theme } = useTheme();

    const defaultfont = 
        variant == "secondary" 
            ? "regular" 
            : "medium";

    const styles = StyleSheet.create({
        text: {
            color:
                variant === "secondary"
                    ? theme.colors.text.secondary
                    : theme.colors.text.text,
            fontSize: theme.text.baseSize,
            fontFamily: 
                font == "default" 
                    ? theme.text.fonts[defaultfont] 
                    : theme.text.fonts[font],
        },
        
        skeletonContainer: {
            minHeight: theme.text.baseSize * 1.2,
            justifyContent: "center",
        },
    });

    if (loading) {
        return (
            <View style={[styles.skeletonContainer, style]}>
                <SkeletonText
                    width={skeletonWidth}
                    numberOfLines={numberOfLines ?? 1}
                    fontSize={theme.text.baseSize}
                />
            </View>
        );
    }

    return (
        <RNText
            style={[styles.text, style]}
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
            {...props}
        >
            {children}
        </RNText>
    );
};

export default Text;