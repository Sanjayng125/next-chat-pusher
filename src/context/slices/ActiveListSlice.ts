import { StateCreator } from "zustand"

export interface ActiveListSliceProps {
    members: string[];
    add: (id: string) => void;
    remove: (id: string) => void;
    set: (ids: string[]) => void;
}

export const createActiveListSlice: StateCreator<ActiveListSliceProps> = (set, get) => ({
    members: [],
    add: (id) => set((state) => ({ members: [...state.members, id] })),
    remove: (id) => set((state) => ({ members: state.members.filter(memberId => memberId !== id) })),
    set: (ids) => set({ members: ids }),
})