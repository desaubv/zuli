
import React, { useMemo, useState } from "react";

import {
    View,
    TextInput,
    Pressable,
    Modal,
    FlatList,
    StyleSheet,
} from "react-native";

import * as LucideIcons from "lucide-react-native";

import {
    Search,
    X,
    Check,
    ChevronDown,
} from "lucide-react-native";

import { useTheme } from "theme/useTheme";
import { useFormField } from "./FormContext";
import Text from "components/Text/Text";

// Obtener los iconos de Lucide
const ICONS = Object.entries(LucideIcons)
    .filter(([name, component]) => {
        if (!/^[A-Z]/.test(name) || !component) return false;

        return (
            typeof component === "function" ||
            (
                typeof component === "object" &&
                component.$$typeof
            )
        );
    })
    .map(([name, component]) => ({
        name,
        component,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

// Acceso directo a los iconos por nombre
const ICONS_MAP = new Map(
    ICONS.map(icon => [icon.name, icon])
);

export default function IconPicker({
    name,
    value,
    onChange,

    // Lista de iconos permitidos
    icons,

    label,
    required = false,
    requiredMessage = "Selecciona un icono.",

    disabled = false,
    editable = true,

    placeholder = "Seleccionar icono",
    searchPlaceholder = "Buscar icono...",
    emptyMessage = "No se encontraron iconos.",
    modalTitle = "Seleccionar icono",
    cancelText = "Cerrar",

    height = "md",
    radius = "md",

    columns = 6,
    iconSize = 24,
    selectedIconSize = 24,

    color,
    selectedColor,
    bgColor,
    modalBackgroundColor,
    overlayColor = "rgba(0,0,0,0.55)",

    showIconName = true,
    showSearch = true,
    showSelectedIndicator = true,

    style,
    inputStyle,
    modalStyle,
    gridStyle,
    iconStyle,

    ...props
}) {
    const { theme } = useTheme();

    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState("");

    // Integración con FormContext
    const {
        value: formValue,
        onChangeText: setFormValue,
        error: formError,
    } = useFormField({
        name,
        required,
        requiredMessage,
    });

    // Priorizar el valor controlado; si no existe, usar FormContext.
    const currentValue = value ?? formValue ?? "";
    const handleChange = onChange ?? setFormValue;

    const isEditable = editable && !disabled;

    // Colores del tema
    const colors = {
        text: color ?? theme.colors.text.text,
        primary: selectedColor ?? theme.colors.primary,
        background: bgColor ?? theme.colors.surface,
        modalBackground: modalBackgroundColor ?? theme.colors.surface,
        border: theme.colors.border,
        error: theme.colors.error,
        muted: theme.colors.text.secondary ?? "#9AA9BA",
    };

    const heights = {
        sm: 55 - 20,
        md: 64 - 20,
        lg: 75 - 20,
    };

    // Obtener el icono seleccionado, incluso si no está
    // incluido en la lista personalizada.
    const selectedIcon = ICONS_MAP.get(currentValue);

    // Lista de iconos disponibles
    const availableIcons = useMemo(() => {
        if (icons === undefined || icons === null) {
            return ICONS;
        }

        if (!Array.isArray(icons)) {
            return [];
        }

        return icons
            .map(iconName => ICONS_MAP.get(iconName))
            .filter(Boolean);
    }, [icons]);

    // Filtrar iconos por nombre
    const filteredIcons = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return availableIcons;

        return availableIcons.filter(({ name }) =>
            name.toLowerCase().includes(query)
        );
    }, [search, availableIcons]);

    const openModal = () => {
        if (!isEditable) return;

        setSearch("");
        setVisible(true);
    };

    const closeModal = () => {
        setVisible(false);
        setSearch("");
    };

    const selectIcon = (iconName) => {
        handleChange?.(iconName);
        closeModal();
    };

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
            color: colors.error,
        },

        input: {
            minHeight: heights[height] ?? heights.md,
            borderWidth: theme.thicknesses.xs,
            borderColor: formError ? colors.error : colors.border,
            borderRadius: theme.radius[radius] ?? theme.radius.md,
            backgroundColor: colors.background,
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
            flex: 1,
            gap: 12,
        },

        selectedName: {
            color: colors.text,
            fontSize: theme.text.baseSize,
        },

        placeholder: {
            color: colors.muted,
            fontSize: theme.text.baseSize,
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
            width: "100%",
            maxWidth: 480,
            maxHeight: "80%",
            backgroundColor: colors.modalBackground,
            borderRadius: theme.radius.lg ?? 16,
            padding: 20,
            gap: 16,
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
            borderRadius: theme.radius.md,
        },

        searchContainer: {
            height: 44,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: theme.radius.md,
            paddingHorizontal: 12,
            gap: 10,
            backgroundColor: theme.colors.background,
        },

        searchInput: {
            flex: 1,
            height: "100%",
            color: colors.text,
            fontSize: theme.text.baseSize,
        },

        grid: {
            ...gridStyle,
        },

        iconButton: {
            aspectRatio: 1,
            width: "19.5%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: "transparent",
            margin: "0.5%",
            ...iconStyle,
        },

        selectedIndicator: {
            position: "absolute",
            top: 3,
            right: 3,
            width: 15,
            height: 15,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
        },

        iconName: {
            fontSize: theme.text.smallSize,
            color: colors.text,
            textAlign: "center",
        },

        empty: {
            padding: 24,
            color: colors.muted,
            textAlign: "center",
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

    const renderIcon = ({ item }) => {
        const Icon = item.component;
        const selected = currentValue === item.name;

        return (
            <Pressable
                onPress={() => selectIcon(item.name)}
                style={[
                    styles.iconButton,
                    selected && {
                        backgroundColor: `${colors.primary}18`,
                        borderColor: colors.primary,
                    },
                ]}
                accessibilityRole="button"
                accessibilityLabel={item.name}
                accessibilityState={{ selected }}
            >
                <Icon
                    size={iconSize}
                    color={selected ? colors.primary : colors.text}
                />

                {showSelectedIndicator && selected && (
                    <View
                        style={[
                            styles.selectedIndicator,
                            { backgroundColor: colors.primary },
                        ]}
                    >
                        <Check size={10} color="#FFFFFF" />
                    </View>
                )}

                {showIconName && (
                    <Text
                        numberOfLines={1}
                        style={styles.iconName}
                    >
                        {item.name}
                    </Text>
                )}
            </Pressable>
        );
    };

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
                style={[
                    styles.input,
                    inputStyle,
                ]}
                accessibilityRole="button"
                accessibilityLabel={label || placeholder}
                accessibilityState={{ disabled: !isEditable }}
                {...props}
            >
                {selectedIcon ? (
                    <View style={styles.selectedRow}>
                        <selectedIcon.component
                            size={selectedIconSize}
                            color={colors.primary}
                        />

                        <Text style={styles.selectedName}>
                            {selectedIcon.name}
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

            {/* Modal de selección */}

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
                statusBarTranslucent
            >
                <View style={styles.overlay}>
                    <View style={styles.modal}>

                        {/* Encabezado */}

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {modalTitle}
                            </Text>

                            <Pressable
                                onPress={closeModal}
                                style={styles.closeButton}
                                hitSlop={8}
                            >
                                <X
                                    size={22}
                                    color={colors.text}
                                />
                            </Pressable>
                        </View>

                        {/* Buscador */}

                        {showSearch && (
                            <View style={styles.searchContainer}>
                                <Search
                                    size={19}
                                    color={colors.muted}
                                />

                                <TextInput
                                    value={search}
                                    onChangeText={setSearch}
                                    placeholder={searchPlaceholder}
                                    placeholderTextColor={colors.muted}
                                    style={styles.searchInput}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                />
                            </View>
                        )}

                        {/* Cuadrícula */}

                        <FlatList
                            data={filteredIcons}
                            keyExtractor={(item) => item.name}
                            renderItem={renderIcon}
                            numColumns={columns}
                            contentContainerStyle={styles.grid}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            initialNumToRender={36}
                            maxToRenderPerBatch={48}
                            windowSize={7}
                            ListEmptyComponent={
                                <Text style={styles.empty}>
                                    {emptyMessage}
                                </Text>
                            }
                        />

                        {/* Cerrar */}

                        <Pressable
                            onPress={closeModal}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelText}>
                                {cancelText}
                            </Text>
                        </Pressable>

                    </View>
                </View>
            </Modal>
        </View>
    );
}
