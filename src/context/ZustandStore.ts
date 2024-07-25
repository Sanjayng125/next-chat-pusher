import { create } from "zustand";
import { createSelectedChatSlice, SelectedChatSliceProps } from "./slices/SelectedChatSlice";
import { createMyChatsSlice, MyChatsSliceProps } from "./slices/MyChatsSlice";
import { createMessagesSlice, MessagesSliceProps } from "./slices/MessagesSlice";
import { createSocketSlice, SocketProps } from "./slices/SocketSlice";
import { createNotificationsSlice, NotificationsSliceProps } from "./slices/NotificationsSlice";
import { ActiveListSliceProps, createActiveListSlice } from "./slices/ActiveListSlice";

export const useMyStore = create<SelectedChatSliceProps & MyChatsSliceProps & MessagesSliceProps & SocketProps & NotificationsSliceProps & ActiveListSliceProps>()((...a) => ({
  ...createSelectedChatSlice(...a),
  ...createMyChatsSlice(...a),
  ...createMessagesSlice(...a),
  ...createSocketSlice(...a),
  ...createNotificationsSlice(...a),
  ...createActiveListSlice(...a)
}));