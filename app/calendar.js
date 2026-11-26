
import Title from "components/Text/Title";
import React, { useState } from "react";

import {
    View,
    StyleSheet
} from "react-native";

import { Calendar, LocaleConfig } from "react-native-calendars"; import { useTheme } from "theme/useTheme";

LocaleConfig.locales["es"] = {
    monthNames: [
        "Enero", "Febrero", "Marzo",
        "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre",
        "Octubre", "Noviembre", "Diciembre"
    ],

    monthNamesShort: [
        "Ene.", "Feb.", "Mar.",
        "Abr.", "May.", "Jun.",
        "Jul.", "Ago.", "Sep.",
        "Oct.", "Nov.", "Dic."
    ],

    dayNames: [
        "Domingo", "Lunes", "Martes",
        "Miércoles", "Jueves", "Viernes", "Sábado"
    ],

    dayNamesShort: [
        "Dom.", "Lun.", "Mar.",
        "Mié.", "Jue.", "Vie.", "Sáb."
    ],

    today: "Hoy"
};

LocaleConfig.defaultLocale = "es";

function MyCalendar() {
    const [selectedDate, setSelectedDate] = useState("");
    const { theme } = useTheme();

    const colors = theme.colors;

    const markedDates = {
        "2026-11-20": {
            marked: true,
            dotColor: colors.primary
        },

        ...(selectedDate && {
            [selectedDate]: {
                selected: true,
                selectedColor: colors.accent,
                selectedTextColor: colors.text.button,
                marked: selectedDate === "2026-11-24",
                dotColor: colors.text.button
            }
        })
    };

    return (
        <Calendar
            onDayPress={(day) => {
                setSelectedDate(day.dateString);
            }}

            markedDates={markedDates}

            style={{
                width: "100%",
                borderRadius: theme.radius.md,
                padding: theme.spacing.md
            }}

            theme={{
                // Superficies
                backgroundColor: "white",
                calendarBackground: "white",

                // Textos
                textSectionTitleColor: colors.text.secondary,
                dayTextColor: colors.text.primary,
                monthTextColor: colors.text.primary,
                textDisabledColor: colors.text.disabled,

                // Selección
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.text.button,

                // Fecha actual
                todayTextColor: colors.primary,

                // Navegación
                arrowColor: colors.primary,

                // Tipografía
                textDayFontSize: 14,
                textMonthFontSize: 17,
                textDayHeaderFontSize: 12,

                textDayFontWeight: "500",
                textMonthFontWeight: "700",
                textDayHeaderFontWeight: "600",

                // Espaciado
                "stylesheet.calendar.header": {
                    week: {
                        marginTop: 8,
                        flexDirection: "row",
                        justifyContent: "space-around"
                    }
                }
            }}
        />
    );
}

const CalendarScreen = () => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.sm,
            backgroundColor: theme.colors.background,
            borderRadius: theme.radius.lg
        },

        calendarContainer: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            overflow: "hidden"
        }
    });

    return (
        <View style={styles.container}>
            <Title style={{ paddingLeft: 5 }}>Calendario</Title>

            <View style={styles.calendarContainer}>
                <MyCalendar />
            </View>
        </View>
    );
};

export default CalendarScreen;
