import { ChatProps, UserProps } from "@/types";
import { StateCreator } from "zustand"

export interface SelectedChatSliceProps {
    selectedChat: ChatProps | null;
    setSelectedChat: (chat: ChatProps | null) => void
}

export const createSelectedChatSlice: StateCreator<SelectedChatSliceProps> = (set, get) => ({
    selectedChat: null,
    setSelectedChat: (chat) => set((state) => ({ selectedChat: chat })),
})