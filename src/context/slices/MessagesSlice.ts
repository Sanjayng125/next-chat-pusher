import { MessageProps } from "@/types";
import { StateCreator } from "zustand"

export interface MessagesSliceProps {
    messages: MessageProps[];
    setMessages: (messages: MessageProps[]) => void
    addMessage: (message: MessageProps) => void
}

export const createMessagesSlice: StateCreator<MessagesSliceProps> = (set, get) => ({
    messages: [],
    setMessages: (messages) => set({ messages: messages }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
})