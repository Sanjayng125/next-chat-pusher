import { StateCreator } from "zustand";

interface NotificationsProps {
    chatId: string;
    message: string;
    createdAt: string;
}

export interface NotificationsSliceProps {
    notifications: NotificationsProps[];
    setNotifications: (notifications: NotificationsProps[]) => void;
    addNotification: (notification: NotificationsProps) => void;
    removeNotification: (notificationId: string) => void;
}

export const createNotificationsSlice: StateCreator<NotificationsSliceProps> = (set) => ({
    notifications: [],
    addNotification: (notification) => set((state) => ({ notifications: [...state.notifications, notification] })),
    setNotifications: (notifications) => set({ notifications }),
    removeNotification: (notificationId: string) => set((state) => ({ notifications: state.notifications.filter((noti) => noti.chatId !== notificationId), })),
});
