import type { ReactNode } from "react";
import React, { createContext, useContext, useRef, useEffect, useState, useCallback } from "react";
import "./NotificationProvider.css";

interface Notification {
    id: string;
    message: string;
    type?: "success" | "error" | "info";
    duration: number;
}

interface NotificationProviderProps {
    children?: ReactNode;
}

interface NotificationContextType {
    sendNotification: (type: "success" | "error" | "info", message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
    return ctx;
};

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const progressRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const sendNotification = useCallback((type: "success" | "error" | "info", message: string, duration = 3000) => {
        const id = Date.now().toString() + Math.random().toString(36).slice(2);
        setNotifications((prev) => [...prev, { id, message, type, duration }]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        }, duration);
    }, []);

    useEffect(() => {
        notifications.forEach((notif) => {
            const progressBar = progressRefs.current[notif.id];
            if (progressBar) {
                progressBar.style.transition = `width ${notif.duration}ms linear`;
                progressBar.style.width = "0%";
                void progressBar.offsetWidth;
                progressBar.style.width = "100%";
            }
        });
    }, [notifications]);

    return (
        <NotificationContext.Provider value={{ sendNotification }}>
            <div className="notifp">
                <div className="notification">
                    {notifications.map((notif) => (
                        <div className={`item ${notif.type || "info"}`} key={notif.id}>
                            <p className="text">{notif.message}</p>
                            <div
                                className="progress"
                                ref={el => { progressRefs.current[notif.id] = el; }}
                                style={{ width: "0%" }}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;