import { StateCreator } from "zustand";

interface NotificationsProps {
    chatId: string;
    message: string;
    createdAt: string;
    count: number;
}

export interface NotificationsSliceProps {
    notifications: NotificationsProps[];
    setNotifications: (notifications: NotificationsProps[]) => void;
    addNotification: (notification: NotificationsProps) => void;
    removeNotification: (notificationId: string) => void;
    incrementCount: (notificationId: string) => void;
}

export const createNotificationsSlice: StateCreator<NotificationsSliceProps> = (set) => ({
    notifications: [],
    addNotification: (notification) => set((state) => ({ notifications: [...state.notifications, notification] })),
    setNotifications: (notifications) => set({ notifications }),
    removeNotification: (notificationId: string) => set((state) => ({ notifications: state.notifications.filter((noti) => noti.chatId !== notificationId), })),
    incrementCount: (notificationId: string) => set((state) => ({ notifications: state.notifications.map((noti) => (noti.chatId === notificationId ? { ...noti, count: noti.count + 1 } : noti)) })),
});
