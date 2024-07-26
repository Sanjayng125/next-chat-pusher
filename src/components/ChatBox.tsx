"use client";

import React, { useEffect, useState } from "react";
import Search from "./Search";
import { useMyStore } from "@/context/ZustandStore";
import { useSession } from "next-auth/react";
import { getMyChats } from "@/lib/actions";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { setNotificationsToRedis } from "@/lib/redis";
import { ChatProps } from "@/types";

export default function ChatBox() {
  const {
    selectedChat,
    setSelectedChat,
    myChats,
    setMyChats,
    setMessages,
    members,
    removeNotification,
    notifications,
  } = useMyStore();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const fetchMyChats = async () => {
    try {
      setLoading(true);
      const res = await getMyChats();

      if (res.success) {
        setMyChats(res.chats);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) fetchMyChats();
  }, [session?.user]);

  const handleChatClick = (chat: ChatProps) => {
    if (selectedChat?._id !== chat._id) {
      setMessages([]);
      setSelectedChat(chat);
      removeNotification(chat._id);
      const updatedNotifications = notifications.filter(
        (noti) => noti.chatId !== chat._id
      );
      setNotificationsToRedis([...updatedNotifications]);
    }
  };

  return (
    <>
      <Search />
      <div className="w-full h-[calc(100vh-164px)] overflow-y-auto">
        {loading && myChats?.length === 0 && (
          <Loader2 className="w-10 h-10 mx-auto animate-spin" />
        )}
        {!loading && (!myChats || myChats?.length <= 0) && (
          <div className="w-full flex items-center justify-center px-3">
            <p className="text-center text-gray-500 font-semibold">
              No chats yet. Start a new chat by searching for a user
            </p>
          </div>
        )}
        {myChats?.length > 0 &&
          myChats?.map(
            (chat, i) =>
              chat?.members?.length > 0 && (
                <button
                  className={`w-full hover:theme-secondary dark:hover:theme-dark-secondary p-3 flex items-center justify-between gap-2 ${
                    selectedChat?._id === chat._id && "theme-secondary"
                  }`}
                  onClick={() => handleChatClick(chat)}
                  key={i}
                >
                  <div className="w-full flex items-center gap-2">
                    <Image
                      src={
                        (chat.isGroup
                          ? chat.groupImg?.url
                          : chat.members[0].avatar.url) ?? "/noavatar.png"
                      }
                      alt="DP"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="w-full flex flex-col items-start truncate">
                      <p className="font-semibold flex gap-2 items-center">
                        <span className="truncate">
                          {chat.isGroup
                            ? chat.groupName
                            : chat?.members[0].username}
                        </span>
                        {!chat.isGroup &&
                        members.indexOf(chat?.members[0].email!) !== -1 ? (
                          <span className="text-xs text-green-500 font-semibold">
                            Online
                          </span>
                        ) : !chat.isGroup ? (
                          <span className="text-xs text-gray-500 font-semibold">
                            Offline
                          </span>
                        ) : (
                          <></>
                        )}
                      </p>
                      {notifications.find(
                        (noti) => noti.chatId === chat._id
                      ) && (
                        <div className="text-sm font-semibold w-full flex items-center justify-between">
                          <p className="truncate">
                            {
                              notifications.find(
                                (noti) => noti.chatId === chat._id
                              )?.message
                            }
                          </p>
                          <p className="flex items-center gap-2">
                            <span>
                              {formatTime(
                                notifications.find(
                                  (noti) => noti.chatId === chat._id
                                )?.createdAt!
                              )}
                            </span>
                            <span className="text-xs bg-green-500 font-semibold rounded-full px-2 py-0.5">
                              {
                                notifications.find(
                                  (noti) => noti.chatId === chat._id
                                )?.count!
                              }
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
          )}
      </div>
    </>
  );
}
