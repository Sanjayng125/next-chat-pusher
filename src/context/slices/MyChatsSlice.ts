import { ChatProps } from "@/types";
import { StateCreator } from "zustand"

export interface MyChatsSliceProps {
    myChats: ChatProps[];
    setMyChats: (chats: ChatProps[]) => void
}

export const createMyChatsSlice: StateCreator<MyChatsSliceProps> = (set, get) => ({
    myChats: [],
    setMyChats: (chats) => set((state) => ({ myChats: chats })),
})