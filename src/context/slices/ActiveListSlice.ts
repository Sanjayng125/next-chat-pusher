import { StateCreator } from "zustand"

export interface ActiveListSliceProps {
    members: Set<string>;
    add: (id: string) => void;
    remove: (id: string) => void;
    set: (ids: string[]) => void;
}

export const createActiveListSlice: StateCreator<ActiveListSliceProps> = (set, get) => ({
    members: new Set(),
    add: (id) => set((state) => ({ members: state.members.add(id) })),
    remove: (id) => set((state) => ({ members: (state.members.delete(id) ? state.members : state.members) })),
    set: (ids) => set({ members: new Set(ids) }),
})