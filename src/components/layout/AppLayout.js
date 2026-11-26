
import { NavigationBar } from "components/navigation/NavigationBar";
import React, { useState, useCallback } from "react";

import {
    View,
    StyleSheet
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { themes } from "theme/themes";

import { useTheme } from "theme/useTheme";

const AppLayout = ({ children, navigation }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    const [layout, setLayout] = useState({
        expanded: true,
        mobile: false,
        sidebarWidth: 210,
        navbarHeight: 0
    });

    const handleLayoutChange = useCallback((newLayout) => {
        setLayout(newLayout);
    }, []);

    const marginBottom = insets.bottom;
    const marginTop = insets.top + 5;

    const styles = StyleSheet.create({
        container: {
            flex: 1
        },

        content: {
            margin: 5,
            flex: 1,

            marginLeft: layout.sidebarWidth == 0 ? 5 : layout.sidebarWidth,
            marginBottom: layout.navbarHeight == 0 ? marginBottom : marginBottom + layout.navbarHeight,

            marginTop: marginTop,
        },
    });

    return (
        <View style={styles.container}>

            <NavigationBar
                onLayoutChange={handleLayoutChange}
            >
                {navigation}
            </NavigationBar>

            <View style={styles.content}>
                {children}
            </View>


        </View>
    );
};

export default AppLayout;
