
import React, { useState } from "react";

import {
    View,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TextInput,
} from "react-native";

import {
    X,
    ChevronDown,
} from "lucide-react-native";

import WheelColorPicker from "react-native-wheel-color-picker";

import { useTheme } from "theme/useTheme";
import { useFormField } from "./FormContext";
import Text from "components/Text/Text";
import Modal from "components/modal/Modal";
import Input from "./Input";
import Button from "components/ui/Button";

const DEFAULT_COLOR = "#087E8B";

const isValidHex = (value) => {
    return /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
};

const normalizeHex = (value) => {
    if (!value) return "";

    const hex = value.startsWith("#")
        ? value
        : `#${value}`;

    if (!isValidHex(hex)) return hex;

    if (hex.length === 4) {
        return (
            "#" +
            hex
                .slice(1)
                .split("")
                .map(c => c + c)
                .join("")
        ).toUpperCase();
    }

    return hex.toUpperCase();
};

export default function ColorPicker({
    name,
    value,
    onChange,

    label,
    required = false,
    requiredMessage = "Selecciona un color.",

    disabled = false,
    editable = true,

    placeholder = "Seleccionar color",
    modalTitle = "Seleccionar color",
    cancelText = "Cerrar",

    height = "md",
    radius = "md",

    wheelSize = 260,
    thumbSize = 25,
    sliderSize = 18,

    selectedColor,
    bgColor,
    modalBackgroundColor,
    overlayColor = "rgba(0,0,0,0.55)",

    showCustomInput = true,
    allowTransparent = false,
    transparentLabel = "Sin color",

    style,
    inputStyle,
    modalStyle,
    wheelStyle,
    customInputStyle,

    ...props
}) {
    const { theme } = useTheme();

    const [visible, setVisible] = useState(false);
    const [customHex, setCustomHex] = useState(DEFAULT_COLOR);

    const {
        value: formValue,
        onChangeText: setFormValue,
        error: formError,
    } = useFormField({
        name,
        required,
        requiredMessage,
    });

    const currentValue = value ?? formValue ?? "";
    const handleChange = onChange ?? setFormValue;

    const isEditable = editable && !disabled;

    const heights = {
        sm: 55 - 20,
        md: 64 - 20,
        lg: 75 - 20,
    };

    const colors = {
        text: theme.colors.text.text,
        primary: selectedColor ?? theme.colors.primary,
        background: bgColor ?? theme.colors.surface,
        surface: theme.colors.surface,
        modalBackground: modalBackgroundColor ?? theme.colors.background,
        border: theme.colors.border,
        error: theme.colors.error,
        muted: theme.colors.text.secondary ?? "#9AA9BA",
    };

    const normalizedValue = normalizeHex(currentValue);

    const normalizedCustomHex = normalizeHex(customHex);

    const validCustomHex = isValidHex(normalizedCustomHex);

    const openModal = () => {
        if (!isEditable) return;

        setCustomHex(
            isValidHex(normalizedValue)
                ? normalizedValue
                : DEFAULT_COLOR
        );

        setVisible(true);
    };

    const closeModal = () => {
        setVisible(false);
        setCustomHex(DEFAULT_COLOR);
    };

    const selectColor = (color) => {
        handleChange?.(color);
        closeModal();
    };

    const applyCustomColor = () => {
        if (!validCustomHex) return;

        selectColor(normalizedCustomHex);
    };

    const handleWheelChange = (color) => {
        const normalized = normalizeHex(color);

        if (isValidHex(normalized)) {
            setCustomHex(normalized);
        }
    };

    const styles = StyleSheet.create({
        wrapper: {
            width: "100%",
        },

        label: {
            marginBottom: 6,
            fontSize: theme.text.baseSize,
            color: colors.text,
        },

        required: {
            color: colors.error,
        },

        input: {
            fontFamily: theme.text.fonts.regular,
            minHeight: heights[height] ?? heights.md,
            borderWidth: theme.thicknesses.xs,
            borderColor: formError ? colors.error : colors.border,
            borderRadius: theme.radius[radius] ?? theme.radius.md,
            backgroundColor: colors.surface,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 8,
            opacity: isEditable ? 1 : 0.6,
        },

        selectedRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },

        preview: {
            width: 27,
            height: 27,
            borderRadius: theme.radius.sm ?? 6,
            borderWidth: 1,
            borderColor: colors.border,
        },

        selectedText: {
            fontSize: theme.text.baseSize,
            color: colors.text,
        },

        placeholder: {
            fontSize: theme.text.baseSize,
            color: colors.muted,
        },

        errorMessage: {
            marginTop: 6,
            marginLeft: 4,
            fontSize: theme.text.smallSize,
            color: colors.error,
        },

        // Modal

        overlay: {
            flex: 1,
            backgroundColor: overlayColor,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
        },

        modal: {
            width: "95%",
            maxWidth: 440,
            maxHeight: "90%",
            backgroundColor: colors.modalBackground,
            gap: 16,
            paddingVertical: theme.spacing.md,
            ...modalStyle,
        },

        modalHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },

        modalTitle: {
            fontSize: theme.text.subheadingSize,
            color: colors.text,
            fontWeight: "600",
        },

        closeButton: {
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
        },

        // Rueda cromática

        wheelContainer: {
            width: "100%",
            height: wheelSize,
            alignItems: "center",
            justifyContent: "center",
            ...wheelStyle,
        },

        wheel: {
            width: "100%",
            height: "100%",
        },

        // Color personalizado

        customSection: {
            gap: 10,
        },

        sectionTitle: {
            color: colors.text,
            fontSize: theme.text.baseSize,
            fontWeight: "600",
        },

        customRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },

        customPreview: {
            width: 42,
            height: 42,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: colors.border,
        },

        customInput: {
            flex: 1,
            height: 44,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: theme.radius.md,
            paddingHorizontal: 12,
            color: colors.text,
            fontSize: theme.text.baseSize,
            fontFamily: theme.text.fonts.regular,
        },

        applyButton: {
            height: 44,
            paddingHorizontal: 14,
            borderRadius: theme.radius.md,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
        },

        applyText: {
            color: "#FFFFFF",
            fontWeight: "600",
        },

        disabledButton: {
            opacity: 0.4,
        },

        transparentButton: {
            minHeight: 38,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: theme.radius.md,
        },

        transparentText: {
            color: colors.text,
            fontSize: theme.text.smallSize,
        },

        cancelButton: {
            minHeight: 42,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.md,
            backgroundColor: colors.primary,
        },

        cancelText: {
            color: "#FFFFFF",
            fontSize: theme.text.baseSize,
            fontWeight: "600",
        },
    });

    return (
        <View style={[styles.wrapper, style]}>

            {/* Label */}

            {label && (
                <Text style={styles.label}>
                    {label}

                    {required && (
                        <Text style={styles.required}> *</Text>
                    )}
                </Text>
            )}

            {/* Control principal */}

            <Pressable
                disabled={!isEditable}
                onPress={openModal}
                style={[styles.input, inputStyle]}
                accessibilityRole="button"
                accessibilityState={{
                    disabled: !isEditable,
                }}
                {...props}
            >
                {normalizedValue && isValidHex(normalizedValue) ? (
                    <View style={styles.selectedRow}>
                        <View
                            style={[
                                styles.preview,
                                {
                                    backgroundColor: normalizedValue,
                                },
                            ]}
                        />

                        <Text style={styles.selectedText}>
                            {normalizedValue}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.placeholder}>
                        {placeholder}
                    </Text>
                )}

                <ChevronDown
                    size={20}
                    color={colors.muted}
                />
            </Pressable>

            {/* Error */}

            {formError && (
                <Text style={styles.errorMessage}>
                    {formError}
                </Text>
            )}

            {/* Modal */}
            <Modal
                isOpen={visible}
                setIsOpen={setVisible}
                title={modalTitle}
                modalStyle={styles.modal}
            >
                <View style={styles.modal}>

                    {/* Rueda cromática */}
                    <View style={styles.wheelContainer}>
                        <WheelColorPicker
                            color={
                                validCustomHex
                                    ? normalizedCustomHex
                                    : DEFAULT_COLOR
                            }
                            onColorChange={handleWheelChange}
                            onColorChangeComplete={handleWheelChange}
                            thumbSize={thumbSize}
                            sliderSize={sliderSize}
                            noSnap
                            row={false}
                            swatches={false}
                            useNativeDriver={false}
                            style={styles.wheel}
                        />
                    </View>

                    {/* Color HEX */}

                    {showCustomInput && (
                        <View style={styles.customSection}>

                            <Text style={styles.sectionTitle}>
                                Color personalizado
                            </Text>

                            <View style={styles.customRow}>

                                <View
                                    style={[
                                        styles.customPreview,
                                        {
                                            backgroundColor: validCustomHex
                                                ? normalizedCustomHex
                                                : "transparent",
                                        },
                                    ]}
                                />

                                <TextInput
                                    value={customHex}
                                    onChangeText={setCustomHex}
                                    placeholder="#087E8B"
                                    placeholderTextColor="#9AA9BA"
                                    style={[
                                        styles.customInput,
                                        customInputStyle,
                                    ]}
                                    autoCapitalize="characters"
                                    autoCorrect={false}
                                    maxLength={7}
                                    selectTextOnFocus
                                />

                                <Pressable
                                    onPress={applyCustomColor}
                                    disabled={!validCustomHex}
                                    style={[
                                        styles.applyButton,
                                        !validCustomHex &&
                                        styles.disabledButton,
                                    ]}
                                >
                                    <Text style={styles.applyText}>
                                        Aplicar
                                    </Text>
                                </Pressable> 

                            </View>
                        </View>
                    )}

                    {/* Sin color */}

                    {allowTransparent && (
                        <Pressable
                            onPress={() => selectColor("")}
                            style={styles.transparentButton}
                        >
                            <Text style={styles.transparentText}>
                                {transparentLabel}
                            </Text>
                        </Pressable>
                    )}
                </View>
            </Modal>

        </View>
    );
}