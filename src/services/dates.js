
const formatDate = (date) => {
    const target = new Date(date);
    const now = new Date();

    if (isNaN(target.getTime())) return "";

    const time = target.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    // Normalizar fechas para comparar únicamente el día
    const targetDay = new Date(
        target.getFullYear(),
        target.getMonth(),
        target.getDate()
    );

    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const diffDays = Math.round(
        (targetDay - today) / (1000 * 60 * 60 * 24)
    );

    // Hoy
    if (diffDays === 0) {
        return `Hoy ${time}`;
    }

    // Ayer
    if (diffDays === -1) {
        return `Ayer ${time}`;
    }

    // Próximos 7 días
    if (diffDays > 0 && diffDays <= 7) {
        const weekday = target.toLocaleDateString("es-MX", {
            weekday: "short",
        });

        return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${time}`;
    }

    // Mismo año
    if (target.getFullYear() === now.getFullYear()) {
        const dayMonth = target.toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
        });

        return `${dayMonth} ${time}`;
    }

    // Otros años
    const fullDate = target.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return `${fullDate} ${time}`;
};


export {
    formatDate,
}