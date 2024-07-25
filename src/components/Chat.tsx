"use client";

import React, { useEffect } from "react";
import ChatBox from "./ChatBox";
import MessageBox from "./MessageBox";
import { useMyStore } from "@/context/ZustandStore";
import { pusherClient } from "@/lib/pusher";
import { MessageProps } from "@/types";
import { useSession } from "next-auth/react";

export default function Chat() {
  const { selectedChat, addNotification, notifications } = useMyStore();
  const { data: session } = useSession();

  useEffect(() => {
    pusherClient.subscribe(`notification`);
    pusherClient.bind(`newMessage`, (data: MessageProps) => {
      if (
        session?.user &&
        data.sender._id !== session?.user?._id &&
        selectedChat?._id !== data?.chatId &&
        notifications.findIndex((noti) => noti.chatId === data.chatId) === -1
      ) {
        addNotification({
          chatId: data.chatId,
          message: data.content,
          createdAt: data.createdAt,
        });
      }
    });

    return () => {
      pusherClient.unbind(`newMessage`);
      pusherClient.unsubscribe(`notification`);
    };
  }, [selectedChat, session?.user, notifications]);

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <>
      <div
        className={`w-full flex flex-col border-r-2 sm:w-2/6 lg:w-[35%] ${
          selectedChat && "max-sm:hidden"
        }`}
      >
        <ChatBox />
      </div>
      <div
        className={`w-full sm:w-4/6 lg:w-[65%] relative overflow-y-auto ${
          !selectedChat && "max-sm:hidden"
        }`}
      >
        {selectedChat ? (
          <MessageBox />
        ) : (
          <p className="text-center">Select any chat and start chatting</p>
        )}
      </div>
    </>
  );
}
