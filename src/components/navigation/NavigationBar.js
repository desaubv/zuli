
import React, { useState, useEffect } from "react";

import {
    View,
    StyleSheet,
    useWindowDimensions
} from "react-native";

import { useTheme } from "theme/useTheme";
import Button from "components/ui/Button";

import { usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NavigationBar = ({ children, onLayoutChange }) => {
    const { theme } = useTheme();
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();


    const isMobile = width < 768;

    const [expanded, setExpanded] = useState(false);
    const [timer, setTimer] = useState(null);

    const sidebarWidth = expanded ? 200 : 55;
    const navbarHeight = 82;

    useEffect(() => {
        onLayoutChange?.({
            expanded,
            mobile: isMobile,

            width: isMobile ? width : sidebarWidth,
            height: isMobile ? navbarHeight : height,

            sidebarWidth: isMobile ? 0 : sidebarWidth + 10,
            navbarHeight: isMobile ? navbarHeight + 10 : 0
        });
    }, [expanded, isMobile, width, height, onLayoutChange]);

    const handleExpand = () => {
        const newTimer = setTimeout(() => {
            setExpanded(true);
        }, 500);

        setTimer(newTimer);
    };
    
    const handleUnexpand = () => {
        if(timer){
            clearTimeout(timer);
            setTimer(null);
        }
        setExpanded(false);

    };

    const styles = StyleSheet.create({
        navbar: {
            position: "absolute",
            zIndex: 1000,

            margin: 5,

            backgroundColor: theme.colors.surface,

            borderColor: theme.colors.border,
            borderWidth: 1,

            borderRadius: theme.radius.lg,

            ...(isMobile
                ? {
                    bottom: insets.bottom,
                    left: 0,
                    right: 0,

                    height: navbarHeight,

                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",

                    paddingHorizontal: theme.spacing.sm,
                }
                : {
                    top: 0,
                    left: 0,
                    bottom: 0,

                    width: sidebarWidth,

                    flexDirection: "column",

                    padding: theme.spacing.md,
                }
            ),
        },

        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: expanded ? "flex-end" : "center",

            marginBottom: theme.spacing.lg,
        },

        items: {
            flex: 1,

            flexDirection: isMobile ? "row" : "column",

            gap: isMobile ? 0 : theme.spacing.md,

            alignItems: isMobile ? "center" : "stretch",

            justifyContent: "flex-start",
        },

        toggle: {
            width: 44,
            height: 44,

            alignItems: "center",
            justifyContent: "center",

            borderRadius: theme.radius.md,
        }
    });

    const renderChild = (child) => {
        if (!React.isValidElement(child)) {
            return child;
        }

        if (child.type === React.Fragment) {
            return React.cloneElement(
                child,
                {},
                React.Children.map(child.props.children, renderChild)
            );
        }

        return React.cloneElement(child, {
            collapsed: !expanded && !isMobile,
            mobile: isMobile
        });
    };

    return (
        <View style={styles.navbar}
            onPointerEnter={handleExpand}
            onPointerLeave={handleUnexpand}
        >
            <View
                style={styles.items}
            >
                {React.Children.map(children, renderChild)}
            </View>

        </View>
    );
};


const NavigationItem = ({
    label,
    href,
    icon = null,

    collapsed = false,
    mobile = false,

    onPress
}) => {
    const { theme } = useTheme();
    const pathname = usePathname();

    const normalizePath = (path) => {
        if (!path || !path.startsWith("/")) {
            return null;
        }

        return path.length > 1
            ? path.replace(/\/+$/, "")
            : "/";
    };

    const currentPath = normalizePath(pathname);
    const targetPath = normalizePath(href);

    const isActive = Boolean(
        currentPath &&
        targetPath &&
        (
            currentPath === targetPath ||
            (
                targetPath !== "/" &&
                currentPath.startsWith(targetPath + "/")
            )
        )
    );

    const accentColor =
        theme.colors.accent ?? theme.colors.primary;

    const contentColor = isActive
        ? theme.colors.text.button
        : theme.colors.primary;

    const iconOnly = collapsed;

    const styles = StyleSheet.create({
        container: {
            width: mobile ? undefined : "100%",
            flex: mobile ? 1 : undefined,
            justifyContent: "center",
            alignItems: "center",
        },


        button: {
            width: "100%",
            minWidth: 20,

            minHeight: mobile ? 64 : 40,

            paddingHorizontal: collapsed
                ? 0
                : theme.spacing.md,

            justifyContent: mobile ? "center" : "flex-start",
            alignItems: "center",

            borderRadius: theme.radius.md,

            backgroundColor: isActive
                ? collapsed ? "transparent" : accentColor
                : "transparent",
        },

        text: {
            fontSize: mobile
                ? theme.text.xsSize ?? 11
                : theme.text.baseSize,

            textAlign: mobile ? "center" : "left",

            color: contentColor,
        }
    });

    return (
        <View style={styles.container}>
            <Button
                href={href}
                onPress={onPress}

                variant="ghost"

                icon={iconOnly ? icon : undefined}
                iconLeft={!iconOnly && !mobile ? icon : undefined}
                iconTop={mobile ? icon : undefined}

                contentColor={contentColor}

                style={styles.button}
                iconStrokeWidth={isActive ? 3 : 2}
                iconColor={isActive ? (collapsed ? accentColor : styles.text.color) : undefined}
                textStyle={styles.text}

            >
                {iconOnly ? undefined : label}
            </Button>
        </View>
    );
};


export { NavigationBar, NavigationItem };
