import React from "react";
import Text from "./Text";
import { useTheme } from "theme/useTheme";

const Title = ({
    children,
    style,
    font = "default",
    ...props
}) => {
    const { theme } = useTheme();

    const customFont = 
        font == "default"
            ? "bold"
            : font;

    return (
        <Text
            style={[
                {
                    color: theme.colors.text.heading,
                    fontSize: theme.text.headingSize,
                    lineHeight: theme.text.headingSize * 1.2,
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

export default Title;