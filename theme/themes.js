const baseTheme = {
    text: {
        smallSize: 12,
        baseSize: 16,
        subheadingSize: 18,
        headingSize: 24,
        big: 30

        // fonts: {
        //     black:      "LexendDeca-Black",
        //     bold:       "LexendDeca-Bold",
        //     extrabold:  "LexendDeca-ExtraBold",
        //     extraligth: "LexendDeca-ExtraLight",
        //     light:      "LexendDeca-Light",
        //     medium:     "LexendDeca-Medium",
        //     regular:    "LexendDeca-Regular",
        //     semibold:   "LexendDeca-SemiBold",
        //     thin:       "LexendDeca-Thin",
        // },
    },

    thicknesses: {
        none: 0,
        xs: 1.5,
        sm: 2,
        md: 2.5,
        lg: 3
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },

    size: {
        xs: "20%",
        sm: "25%",
        md: "50%",
        lg: "70%",
        xl: "85%",
        all: "90%",
    },

    radius: {
        sm: 6,
        md: 12,
        lg: 24,
        full: 100
    },

    colors: {
        "background": "#F0FDF4",
        "surface": "#E2E8F0",

        "primary": "#0F766E",
        "secondary": "#14B8A6",
        "accent": "#22C55E",

        "text": {
            "heading": "#0F766E",
            "text": "#0F172A",
            "secondary": "#555555",
            "button": "#f3f6fd",
            "ghost": "#b9b4b4",
            "disabled": "#9CA3AF",
            "inverse": "#FFFFFF"
        },

        "border": "#D8E1EA",

        modal: {
            "success": "#6ac668",
            "successBackground": "#EAF8E9",

            "warning": "#dbec5e",
            "warningBackground": "#F9FCE5",
            "warningText": "#59620A",

            "error": "#ec5e5e",
            "errorBackground": "#FDECEC",

            "info": "#549df1",
            "infoBackground": "#EAF3FE",
        },

        "focus": "#087E8B",
        "overlay": "#00000066",
        "shadow": "#152D3B"
    },
};


export const themes = {
    light: {
        name: "light",
        ...baseTheme,

        colors: {
            ...baseTheme.colors,
        }
    },

    dark: {
        name: "dark",
        ...baseTheme,

        colors: {
            ...baseTheme.colors,

            "background": "#202b32",
            "surface": "#131d27",

            "text": {
                ...baseTheme.colors.text,

                "text": "#F0FDF4",
                "secondary": "#b7b7b7",
                "button": "#f3f6fd",
                "ghost": "#b9b4b4",
                "disabled": "#9CA3AF",
                "inverse": "#FFFFFF"
            },


        },
    }
};