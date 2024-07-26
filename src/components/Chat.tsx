"use client";

import React, { useEffect } from "react";
import ChatBox from "./ChatBox";
import MessageBox from "./MessageBox";
import { useMyStore } from "@/context/ZustandStore";
import { pusherClient } from "@/lib/pusher";
import { MessageProps } from "@/types";
import { useSession } from "next-auth/react";
import {
  getNotificationsFromRedis,
  setNotificationsToRedis,
} from "@/lib/redis";

export default function Chat() {
  const {
    selectedChat,
    setNotifications,
    addNotification,
    incrementCount,
    notifications,
  } = useMyStore();
  const { data: session } = useSession();

  useEffect(() => {
    pusherClient.subscribe(`notification`);
    pusherClient.bind(`newMessage`, (data: MessageProps) => {
      if (
        session?.user &&
        data.sender._id !== session?.user?._id &&
        selectedChat?._id !== data?.chatId
      ) {
        if (
          notifications.findIndex((noti) => noti.chatId === data.chatId) === -1
        ) {
          addNotification({
            chatId: data.chatId,
            message: data.content,
            createdAt: data.createdAt,
            count: 1,
          });
          setNotificationsToRedis([
            ...notifications,
            {
              chatId: data.chatId,
              message: data.content,
              createdAt: data.createdAt,
              count: 1,
            },
          ]);
        } else {
          // increment count
          incrementCount(data.chatId);
          const updatedNotifications = notifications.map((noti) =>
            noti.chatId === data.chatId
              ? { ...noti, count: noti.count + 1 }
              : noti
          );
          setNotificationsToRedis([...updatedNotifications]);
        }
      }
    });

    return () => {
      pusherClient.unbind(`newMessage`);
      pusherClient.unsubscribe(`notification`);
    };
  }, [selectedChat, session?.user, notifications]);

  useEffect(() => {
    const getNotifications = async () => {
      const redisNotifications = await getNotificationsFromRedis();
      if (redisNotifications.length > 0) {
        setNotifications(redisNotifications);
      }
    };
    if (session?.user) {
      getNotifications();
    }
  }, [session?.user.email]);

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
