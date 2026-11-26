import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import defaultLogo from "assets/logos/zuli_no_bg.png"
import whiteLogo from "assets/logos/zuli_no_bg_white.png"
import borderedtLogo from "assets/logos/zuli.png"

const Logo = ({
    size = 22,
    variant = "default",
    style
}) => {
    const logos = {
        default: defaultLogo,
        white: whiteLogo,
        bordered: borderedtLogo
    }


    const styles = StyleSheet.create({
        container: {
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
            
        },

        image: {
            width: "100%",
            height: "100%",
        },
    });

    return (
        <View style={[styles.container, style]}>
            <Image
                source={logos[variant.toLowerCase()]}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );
};

export default Logo;