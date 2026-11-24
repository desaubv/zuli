
class NotificationService {
    static platform = null;
    static nativeNotifications = null;
    static initialized = false;

    static timers = new Map();
    static STORAGE_KEY = "app:scheduled-notifications";

    // Detectar entorno automáticamente
    static detectPlatform() {
        if (
            typeof navigator !== "undefined" &&
            navigator.product === "ReactNative"
        ) {
            return "native";
        }

        if (
            typeof window !== "undefined" &&
            typeof window.document !== "undefined"
        ) {
            return "web";
        }

        throw new Error("Plataforma no soportada");
    }

    static async initialize() {
        this.platform = this.detectPlatform();

        if (this.platform === "native") {
            const Notifications = await import("expo-notifications");
            const { Platform } = await import("react-native");

            this.nativeNotifications = Notifications;

            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                }),
            });

            // if (Platform.OS === "android") {
            //     await Notifications.setNotificationChannelAsync("default", {
            //         name: "Notificaciones generales",
            //         importance: Notifications.AndroidImportance.MAX,
            //         vibrationPattern: [0, 250, 250, 250],
            //     });
            // }

            const { status: currentStatus } =
                await Notifications.getPermissionsAsync();

            let status = currentStatus;

            if (status !== "granted") {
                const result =
                    await Notifications.requestPermissionsAsync();

                status = result.status;
            }

            this.initialized = true;
            return status === "granted";
        }

        // WEB
        if (!("Notification" in window)) {
            throw new Error("Este navegador no soporta notificaciones");
        }

        let permission = Notification.permission;

        if (permission === "default") {
            permission = await Notification.requestPermission();
        }

        this.initialized = true;

        // Recuperar programaciones después de recargar la página
        this.restoreWebNotifications();

        return permission === "granted";
    }

    static ensureInitialized() {
        if (!this.initialized) {
            throw new Error(
                "NotificationService no ha sido inicializado"
            );
        }
    }

    static createId() {
        return globalThis.crypto?.randomUUID?.() ??
            `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    // =========================
    // PROGRAMAR
    // =========================

    static async scheduleInSeconds(title, body, seconds) {
        if (!Number.isFinite(seconds) || seconds <= 0) {
            throw new Error("El tiempo debe ser mayor a cero");
        }

        const date = new Date(Date.now() + seconds * 1000);

        return this.scheduleAt(title, body, date);
    }

    static async scheduleAt(title, body, date) {
        this.ensureInitialized();

        const targetDate = new Date(date);

        if (Number.isNaN(targetDate.getTime()) ||
            targetDate.getTime() <= Date.now()) {
            throw new Error("La fecha debe ser futura y válida");
        }

        if (this.platform === "native") {
            return this.nativeNotifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    sound: true,
                },
                trigger: {
                    type: this.nativeNotifications
                        .SchedulableTriggerInputTypes.DATE,
                    date: targetDate,
                },
            });
        }

        const notification = {
            id: this.createId(),
            title,
            body,
            type: "once",
            date: targetDate.getTime(),
        };

        this.saveWebNotification(notification);
        this.startWebTimer(notification);

        return notification.id;
    }

    static async scheduleDaily(title, body, hour, minute) {
        this.ensureInitialized();

        if (
            !Number.isInteger(hour) || hour < 0 || hour > 23 ||
            !Number.isInteger(minute) || minute < 0 || minute > 59
        ) {
            throw new Error("Hora o minuto inválido");
        }

        if (this.platform === "native") {
            return this.nativeNotifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    sound: true,
                },
                trigger: {
                    type: this.nativeNotifications
                        .SchedulableTriggerInputTypes.DAILY,
                    hour,
                    minute,
                    channelId: "default",
                },
            });
        }

        const notification = {
            id: this.createId(),
            title,
            body,
            type: "daily",
            hour,
            minute,
            date: this.getNextDailyDate(hour, minute),
        };

        this.saveWebNotification(notification);
        this.startWebTimer(notification);

        return notification.id;
    }

    // =========================
    // WEB: TEMPORIZADORES
    // =========================

    static startWebTimer(notification) {
        const MAX_TIMEOUT = 2147483647;

        const remaining = notification.date - Date.now();

        if (remaining <= 0) {
            this.fireWebNotification(notification);
            return;
        }

        const timer = setTimeout(() => {
            if (remaining > MAX_TIMEOUT) {
                this.startWebTimer(notification);
            } else {
                this.fireWebNotification(notification);
            }
        }, Math.min(remaining, MAX_TIMEOUT));

        this.timers.set(notification.id, timer);
    }

    static fireWebNotification(notification) {
        if (Notification.permission === "granted") {
            new Notification(notification.title, {
                body: notification.body,
                icon: "/favicon.ico",
            });
        }

        if (notification.type === "daily") {
            notification.date = this.getNextDailyDate(
                notification.hour,
                notification.minute
            );

            this.updateWebNotification(notification);
            this.startWebTimer(notification);
        } else {
            this.removeWebNotification(notification.id);
        }
    }

    static getNextDailyDate(hour, minute) {
        const date = new Date();

        date.setHours(hour, minute, 0, 0);

        if (date.getTime() <= Date.now()) {
            date.setDate(date.getDate() + 1);
        }

        return date.getTime();
    }

    // =========================
    // ALMACENAMIENTO WEB
    // =========================

    static getWebStorage() {
        try {
            return JSON.parse(
                localStorage.getItem(this.STORAGE_KEY) || "[]"
            );
        } catch {
            return [];
        }
    }

    static persistWebStorage(notifications) {
        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(notifications)
        );
    }

    static saveWebNotification(notification) {
        const notifications = this.getWebStorage();

        notifications.push(notification);

        this.persistWebStorage(notifications);
    }

    static updateWebNotification(notification) {
        const notifications = this.getWebStorage();

        const updated = notifications.map(item =>
            item.id === notification.id ? notification : item
        );

        this.persistWebStorage(updated);
    }

    static removeWebNotification(id) {
        const notifications = this.getWebStorage()
            .filter(item => item.id !== id);

        this.persistWebStorage(notifications);
        this.timers.delete(id);
    }

    static restoreWebNotifications() {
        const notifications = this.getWebStorage();

        for (const notification of notifications) {
            // No ejecutar notificaciones que vencieron mientras
            // la página estaba cerrada.
            if (notification.date <= Date.now()) {
                if (notification.type === "daily") {
                    notification.date = this.getNextDailyDate(
                        notification.hour,
                        notification.minute
                    );

                    this.updateWebNotification(notification);
                } else {
                    this.removeWebNotification(notification.id);
                    continue;
                }
            }

            this.startWebTimer(notification);
        }
    }

    // =========================
    // CONSULTAR Y CANCELAR
    // =========================

    static async getScheduled() {
        this.ensureInitialized();

        if (this.platform === "native") {
            return this.nativeNotifications
                .getAllScheduledNotificationsAsync();
        }

        return this.getWebStorage();
    }

    static async cancel(identifier) {
        this.ensureInitialized();

        if (this.platform === "native") {
            return this.nativeNotifications
                .cancelScheduledNotificationAsync(identifier);
        }

        const timer = this.timers.get(identifier);

        if (timer) {
            clearTimeout(timer);
        }

        this.removeWebNotification(identifier);
    }

    static async cancelAll() {
        this.ensureInitialized();

        if (this.platform === "native") {
            return this.nativeNotifications
                .cancelAllScheduledNotificationsAsync();
        }

        for (const timer of this.timers.values()) {
            clearTimeout(timer);
        }

        this.timers.clear();
        this.persistWebStorage([]);
    }
}

export default NotificationService;
