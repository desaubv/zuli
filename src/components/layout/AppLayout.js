
import { NavigationBar } from "components/navigation/NavigationBar";
import React, { useState, useCallback } from "react";

import {
    View,
    StyleSheet
} from "react-native";

import { useTheme } from "theme/useTheme";

const AppLayout = ({ children, navigation }) => {
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

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
        },

        content: {
            margin: 5,
            flex: 1,
            minWidth: 0,
                        
            borderRadius: 100,

            marginLeft: layout.sidebarWidth == 0 ? 5 : layout.sidebarWidth,
            marginBottom: layout.navbarHeight == 0 ? 5 : layout.navbarHeight,
        }
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
