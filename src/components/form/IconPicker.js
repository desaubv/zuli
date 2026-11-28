
import React, { useMemo, useState } from "react";

import {
    View,
    Pressable,
    FlatList,
    StyleSheet,
} from "react-native";

import {Book,
    ChevronDown,
    Check,
    RefreshCw,
    AlertTriangle,
    Home,
    Folder,
    File,
    Calendar,
    Clock,
    BookOpen,
    Notebook,
    NotebookPen,
    GraduationCap,
    Target,
    Star,
    Heart,
    Bookmark,
    Tag,
    Palette,
    Image,
    Camera,
    Mail,
    MessageCircle,
    Phone,
    Bell,
    User,
    Users,
    Settings,
    Shield,
    Lock,
    Database,
    Code,
    Terminal,
    Cpu,
    Monitor,
    Laptop,
    Smartphone,
    Wifi,
    Bluetooth,
    ChartBar,
    ChartLine,
    ChartPie,
    Calculator,
    Wallet,
    CreditCard,
    ShoppingCart,
    Gift,
    Leaf,
    Cloud,
    Sun,
    Moon,
    MapPin,
    Compass,
    Car,
    Plane,
    Plus,
    Minus,
    X,
    Info,
    HelpCircle,
    AlertCircle,
    Trash2,
    Pencil,
    Eraser,
    Scissors,
    Paintbrush,
    Layers,
    Download,
    Upload,
    Save,
    Copy,
    Archive,
    Search,
    Filter,
    SlidersHorizontal,
    Wrench,
    Zap,
    Flame,
    Trophy,
    Award,
    Lightbulb,
    Sparkles,
    Music,
    Video,
    Mic,
    Gamepad2,
    Package,
    Receipt,
    Banknote,
    Server,
    GitBranch,
    Globe,
    Link,
    Share2,
    Network,
    Fingerprint,
    Eye,
    EyeOff,
    Power,
    LogIn,
    LogOut,
    Maximize,
    Minimize,
    RefreshCw as RefreshIcon,
    CircleCheck,
    CircleX,
    Clipboard,
    ClipboardCheck,
    ListTodo,
    CheckCheck,
    Timer,
    AlarmClock,
    ArrowLeft,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Menu,
    MoreHorizontal,
    MoreVertical,
    PanelLeft,
    PanelRight,
    Map as MapIcon,
    Navigation,
    Locate,
    Bike,
    Train,
    TreePine,
    Flower,
    Sprout,
    Droplets,
    Wind,
    CloudSun,
    FileText,
    FilePlus,
    FileCheck,
    Files,
    FolderOpen,
    FolderPlus,
    Paperclip,
    MailOpen,
    Send,
    MessagesSquare,
    Video as VideoIcon,
    Contact,
    UserPlus,
    IdCard,
    ShieldCheck,
    LockOpen,
    Key,
    HardDrive,
    CodeXml,
    Tablet,
    Usb,
    CircuitBoard,
    Bug,
    TrendingUp,
    TrendingDown,
    Activity,
    Gauge,
    Sigma,
    Binary,
    Tags,
    Car as CarIcon,
    Bike as BikeIcon,
    ShoppingBag,
    CloudSun as CloudSunIcon,
    Power as PowerIcon,
    ExternalLink,
    RotateCcw,
} from "lucide-react-native";

import { useTheme } from "theme/useTheme";
import { useFormField } from "./FormContext";
import Text from "components/Text/Text";
import Modal from "components/modal/Modal";

// Colección predeterminada

const ICONS_MAP = {
    Book,
    Home,
    Folder,
    File,
    Calendar,
    Clock,
    BookOpen,
    Notebook,
    NotebookPen,
    GraduationCap,
    Target,
    Star,
    Heart,
    Bookmark,
    Tag,
    Palette,
    Image,
    Camera,
    Mail,
    MessageCircle,
    Phone,
    Bell,
    User,
    Users,
    Settings,
    Shield,
    Lock,
    Database,
    Code,
    Terminal,
    Cpu,
    Monitor,
    Laptop,
    Smartphone,
    Wifi,
    Bluetooth,
    ChartBar,
    ChartLine,
    ChartPie,
    Calculator,
    Wallet,
    CreditCard,
    ShoppingCart,
    Gift,
    Leaf,
    Cloud,
    Sun,
    Moon,
    MapPin,
    Compass,
    Car,
    Plane,
    Plus,
    Minus,
    X,
    Info,
    HelpCircle,
    AlertCircle,
    AlertTriangle,
    Trash2,
    Pencil,
    Eraser,
    Scissors,
    Paintbrush,
    Layers,
    Download,
    Upload,
    Save,
    Copy,
    Archive,
    Search,
    Filter,
    SlidersHorizontal,
    Wrench,
    Zap,
    Flame,
    Trophy,
    Award,
    Lightbulb,
    Sparkles,
    Music,
    Video,
    Mic,
    Gamepad2,
    Package,
    Receipt,
    Banknote,
    Server,
    GitBranch,
    Globe,
    Link,
    Share2,
    Network,
    Fingerprint,
    Eye,
    EyeOff,
    Power,
    LogIn,
    LogOut,
    Maximize,
    Minimize,
    RefreshCw,
    CircleCheck,
    CircleX,
    Clipboard,
    ClipboardCheck,
    ListTodo,
    CheckCheck,
    Timer,
    AlarmClock,
    ArrowLeft,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Menu,
    MoreHorizontal,
    MoreVertical,
    PanelLeft,
    PanelRight,
    Map: MapIcon,
    Navigation,
    Locate,
    Bike,
    Train,
    TreePine,
    Flower,
    Sprout,
    Droplets,
    Wind,
    CloudSun,
    FileText,
    FilePlus,
    FileCheck,
    Files,
    FolderOpen,
    FolderPlus,
    Paperclip,
    MailOpen,
    Send,
    MessagesSquare,
    Contact,
    UserPlus,
    IdCard,
    ShieldCheck,
    LockOpen,
    Key,
    HardDrive,
    CodeXml,
    Tablet,
    Usb,
    CircuitBoard,
    Bug,
    TrendingUp,
    TrendingDown,
    Activity,
    Gauge,
    Sigma,
    Binary,
    Tags,
    ShoppingBag,
    ExternalLink,
    RotateCcw,
};

// Formato:
// { name: "Home", component: Home }

const ICONS = Object.entries(ICONS_MAP)
    .map(([name, component]) => ({
        name,
        component,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

const ICONS_LOOKUP = Object.fromEntries(
    ICONS.map(icon => [icon.name, icon])
);

export default function IconPicker({
    name,
    value,
    onChange,

    icons: customIcons,

    label,
    required = false,
    requiredMessage = "Selecciona un icono.",

    disabled = false,
    editable = true,

    placeholder = "Seleccionar icono",
    modalTitle = "Seleccionar icono",
    cancelText = "Cerrar",

    height = "md",
    radius = "md",

    columns = 5,
    iconSize = 24,
    selectedIconSize = 22,

    selectedColor,
    bgColor,
    modalBackgroundColor,
    overlayColor = "rgba(0,0,0,0.55)",

    showIconName = true,
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

    const availableIcons = useMemo(() => {
        if (customIcons == null) return ICONS;

        return customIcons
            .map(item => {
                if (typeof item === "string") {
                    return ICONS_LOOKUP[item];
                }

                if (typeof item === "object" && item.name) {
                    return {
                        name: item.name,
                        component: item.component ?? ICONS_LOOKUP[item.name]?.component,
                    };
                }

                return null;
            })
            .filter(item => item?.component);
    }, [customIcons]);

    const selectedItem = ICONS_LOOKUP[currentValue] ??
        availableIcons.find(item => item.name === currentValue);

    const colors = {
        text: theme.colors.text.text,
        primary: selectedColor ?? theme.colors.primary,
        surface: bgColor ?? theme.colors.surface,
        modalBackground: modalBackgroundColor ?? theme.colors.background,
        border: theme.colors.border,
        error: theme.colors.error,
        muted: theme.colors.text.secondary ?? "#9AA9BA",
    };

    const heights = {
        sm: 35,
        md: 44,
        lg: 55,
    };

    const selectIcon = (iconName) => {
        handleChange?.(iconName);
        setVisible(false);
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

        selectedIcon: {
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
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

        modal: {
            width: "95%",
            maxWidth: 440,
            maxHeight: "90%",
            backgroundColor: colors.modalBackground,
            paddingVertical: theme.spacing.xs,
            ...modalStyle,
        },

        grid: {
            width: "100%",
            paddingBottom: theme.spacing.sm,
            ...gridStyle,
        },

        iconButton: {
            flex: 1,
            maxWidth: `${100 / columns}%`,
            aspectRatio: 1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: "transparent",
            backgroundColor: colors.surface,
            margin: 2,
            gap: 5,
            ...iconStyle,
        },

        selectedButton: {
            backgroundColor: colors.primary + "20",
            borderColor: colors.primary,
        },

        iconLabel: {
            fontSize: 10,
            color: colors.text,
            textAlign: "center",
        },

        selectedIndicator: {
            position: "absolute",
            top: 4,
            right: 4,
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
                    selected && styles.selectedButton,
                ]}
                accessibilityRole="button"
                accessibilityLabel={item.name}
                accessibilityState={{ selected }}
            >
                <Icon
                    size={iconSize}
                    color={selected ? colors.primary : colors.text}
                />

                {showIconName && (
                    <Text style={styles.iconLabel} numberOfLines={1}>
                        {item.name}
                    </Text>
                )}

                {selected && showSelectedIndicator && (
                    <View style={styles.selectedIndicator}>
                        <Check
                            size={12}
                            color={colors.primary}
                        />
                    </View>
                )}
            </Pressable>
        );
    };

    return (
        <View style={[styles.wrapper, style]}>

            {label && (
                <Text style={styles.label}>
                    {label}
                    {required && (
                        <Text style={styles.required}> *</Text>
                    )}
                </Text>
            )}

            <Pressable
                disabled={!isEditable}
                onPress={() => setVisible(true)}
                style={[styles.input, inputStyle]}
                accessibilityRole="button"
                accessibilityState={{ disabled: !isEditable }}
                {...props}
            >
                {selectedItem ? (
                    <View style={styles.selectedRow}>
                        <View style={styles.selectedIcon}>
                            {React.createElement(selectedItem.component, {
                                size: selectedIconSize,
                                color: colors.primary,
                            })}
                        </View>

                        <Text style={styles.selectedText}>
                            {selectedItem.name}
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

            {formError && (
                <Text style={styles.errorMessage}>
                    {formError}
                </Text>
            )}

            <Modal
                isOpen={visible}
                setIsOpen={setVisible}
                title={modalTitle}
                modalStyle={styles.modal}
            >
                <View style={styles.modal}>

                    <FlatList
                        data={availableIcons}
                        keyExtractor={item => item.name}
                        numColumns={columns}
                        renderItem={renderIcon}
                        contentContainerStyle={styles.grid}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    />

                </View>
            </Modal>
        </View>
    );
}
