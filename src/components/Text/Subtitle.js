import React from "react";
import Text from "./Text";
import { useTheme } from "theme/useTheme";

const Subtitle = ({
    children,
    style,
    font = "default",
    ...props
}) => {
    const { theme } = useTheme();

    const customFont = 
        font == "default"
            ? "semibold"
            : font;

    return (
        <Text
            style={[
                {
                    fontSize: theme.text.subtitleSize,
                    lineHeight: theme.text.subtitleSize * 1.3,
                },
                style,
            ]}
            font={customFont}
            {...props}
        >
            {children}
        </Text>
    );
};

export default Subtitle;