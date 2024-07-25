import { StateCreator } from "zustand"
import { Socket } from "socket.io-client"

export interface SocketProps {
    socket: Socket | null
    setSocket: (sockek: Socket) => void
}

export const createSocketSlice: StateCreator<SocketProps> = (set) => ({
    socket: null,
    setSocket: (socket) => set(() => ({ socket: socket }))
})