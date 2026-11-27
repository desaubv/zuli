
import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    Pressable,
    StyleSheet,
} from "react-native";

import { useTheme } from "theme/useTheme";
import { useFormField } from "./FormContext";
import Text from "components/Text/Text";

export default function Input({
    name,
    value,
    onChangeText,
    placeholder,

    label,
    required = false,
    requiredMessage = "Este campo es obligatorio.",

    disabled = false,

    iconLeft: IconLeft,
    iconRight: IconRight,
    onIconRightPress,
    iconColor,

    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize = "none",
    autoCorrect = false,

    height = "md",
    radius = "md",

    editable = true,
    style,
    inputStyle,

    regex,
    regexMessage = "El formato no es válido.",

    transformFunction,

    multiline = false,
    numberOfLines = 4,
    minHeight,
    textAlignVertical,

    bgColor,

    ...props
}) {
    const { theme } = useTheme();

    const {
        value: formValue,
        onChangeText: setFormValue,
        error: formError,
    } = useFormField({
        name,
        required,
        requiredMessage,
        regex,
        regexMessage,
    });

    const currentValue = value ?? formValue ?? "";
    const handleChangeText = onChangeText ?? setFormValue;

    const heights = {
        "sm": 55 - 20,
        "md": 64 - 20,
        "lg": 75 - 20
    }

    const handleTextChange = (text) => {
        const transformedValue = transformFunction
            ? transformFunction(text)
            : text;

        handleChangeText(transformedValue);
    };

    // El campo queda bloqueado si disabled o editable=false.
    const isEditable = editable && !disabled;

    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        // La validación del formulario tiene prioridad.
        if (formError !== undefined) {
            setLocalError(null);
            return;
        }

        if (!regex || !currentValue) {
            setLocalError(null);
            return;
        }

        regex.lastIndex = 0;
        const valid = regex.test(String(currentValue));
        regex.lastIndex = 0;

        setLocalError(valid ? null : regexMessage);
    }, [currentValue, regex, regexMessage, formError]);

    const validationMessage = formError ?? localError;
    const showregexMessage = Boolean(validationMessage);

    const styles = StyleSheet.create({
        wrapper: {
            width: "100%",
        },

        label: {
            marginBottom: 6,
            fontSize: theme.text.baseSize,
            color: theme.colors.text.text,
        },

        required: {
            color: theme.colors.error,
        },

        container: {
            height: multiline ? undefined : heights[height] ?? heights["md"],
            minHeight: multiline
                ? minHeight ?? numberOfLines * 24 + 32
                : undefined,

            borderWidth: theme.thicknesses.xs,
            borderColor: theme.colors.border,
            borderRadius: theme.radius[radius] ?? theme.radius["md"],
            backgroundColor: bgColor ? bgColor : theme.colors.surface,
            flexDirection: "row",
            alignItems: multiline ? "flex-start" : "center",
            paddingHorizontal: 16,
            paddingVertical: multiline ? 12 : 0,
            opacity: isEditable ? 1 : 0.6,
        },

        containerregexMessage: {
            borderColor: theme.colors.error,
        },

        leftIcon: {
            marginRight: 14,
        },

        input: {
            flex: 1,
            fontFamily: theme.text.fonts.regular,
            height: multiline ? undefined : "100%",
            minHeight: multiline ? numberOfLines * 24 : undefined,
            fontSize: theme.text.baseSize,
            color: theme.colors.text.text,
            paddingVertical: 0,
            paddingHorizontal: 0,
            textAlignVertical: textAlignVertical ?? (
                multiline ? "top" : "center"
            ),
        },

        inputWithLeftIcon: {},

        inputWithRightIcon: {
            paddingRight: 8,
        },

        rightButton: {
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
        },

        regexMessage: {
            marginTop: 6,
            marginLeft: 4,
            fontSize: theme.text.smallSize,
            color: theme.colors.error,
        },
    });

    return (
        <View style={[styles.wrapper, style]}>
            {label ? (
                <Text style={styles.label}>
                    {label}
                    {required && (
                        <Text style={styles.required}> *</Text>
                    )}
                </Text>
            ) : null}

            <View
                style={[
                    styles.container,
                    showregexMessage && styles.containerregexMessage,
                ]}
            >
                {IconLeft && (
                    <IconLeft
                        size={24}
                        color={iconColor || theme.colors.primary}
                        strokeWidth={2}
                        style={styles.leftIcon}
                    />
                )}

                <TextInput
                    value={currentValue}
                    onChangeText={handleTextChange}
                    placeholder={placeholder}
                    placeholderTextColor="#9AA9BA"
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    editable={isEditable}
                    multiline={multiline}
                    numberOfLines={multiline ? numberOfLines : undefined}
                    style={[
                        styles.input,
                        IconLeft && styles.inputWithLeftIcon,
                        IconRight && styles.inputWithRightIcon,
                        inputStyle,
                    ]}
                    {...props}
                />

                {IconRight && (
                    <Pressable
                        onPress={onIconRightPress}
                        disabled={!onIconRightPress || !isEditable}
                        style={styles.rightButton}
                        hitSlop={8}
                    >
                        <IconRight
                            size={24}
                            color={iconColor || theme.colors.primary}
                            strokeWidth={2}
                        />
                    </Pressable>
                )}
            </View>

            {showregexMessage && (
                <Text style={styles.regexMessage}>
                    {validationMessage}
                </Text>
            )}
        </View>
    );
}
