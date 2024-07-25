"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMyStore } from "@/context/ZustandStore";
import { addMember, getChat, getMyChats, removeMember } from "@/lib/actions";
import { ChatProps } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { toast } from "./ui/use-toast";

export function ManageMembersModel() {
  const { selectedChat, setSelectedChat, myChats, setMyChats } = useMyStore();
  const [loading, setLoading] = useState(false);

  const handleRemoveMember = async (memberId: string) => {
    if (selectedChat?.isGroup) {
      setLoading(true);
      try {
        const res = await removeMember(
          selectedChat?._id.toString(),
          memberId.toString()
        );

        if (res?.success) {
          setSelectedChat(res.chat);
          const chatsRes = await getMyChats();

          if (chatsRes.success) {
            setMyChats(chatsRes.chats);
          }
        }

        toast({
          title: res.success ? "Success" : "Error",
          description: res.message,
          variant: res.success ? "default" : "destructive",
          duration: 3000,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddMember = async (memberId: string) => {
    if (selectedChat?.isGroup) {
      setLoading(true);
      try {
        const res = await addMember(
          selectedChat?._id.toString(),
          memberId.toString()
        );

        if (res?.success) {
          setSelectedChat(res.chat);

          const chatsRes = await getMyChats();

          if (chatsRes.success) {
            setMyChats(chatsRes.chats);
          }
        }

        toast({
          title: res.success ? "Success" : "Error",
          description: res.message,
          variant: res.success ? "default" : "destructive",
          duration: 3000,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"sm"}>
          Manage Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add/Remove Members</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* group members */}
          {selectedChat?.isGroup && (
            <div className="w-full">
              <p className="font-semibold">
                Members (min 2): {selectedChat?.members?.length}
              </p>
              <ul className="w-full max-h-44 overflow-y-auto border-2 rounded">
                {selectedChat?.members?.map((member, index) => (
                  <li
                    key={index}
                    className="p-2 hover:theme-secondary dark:hover:theme-dark-secondary border-b last:border-b-0 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <Button
                      size={"sm"}
                      variant={"ghost"}
                      className="w-full flex-1 flex items-center justify-start gap-2"
                      onClick={async () => {
                        const chatRes = await getChat(member._id);

                        if (chatRes?.success) {
                          setSelectedChat(chatRes.chat);
                        }
                      }}
                    >
                      <Image
                        src={member?.avatar?.url ?? "/noavatar.png"}
                        alt="DP"
                        width={32}
                        height={32}
                        quality={100}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <p>{member?.username}</p>
                    </Button>
                    <Button
                      size={"sm"}
                      variant={"destructive"}
                      className="z-10"
                      disabled={loading || selectedChat?.members?.length <= 2}
                      onClick={() => handleRemoveMember(member._id)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* My chats */}
          <hr />
          {myChats?.length > 0 ? (
            <div className="w-full">
              <p className="font-semibold">Contacts:</p>
              <ul className="w-full max-h-44 overflow-y-auto border-2 rounded">
                {myChats.map(
                  (chat: ChatProps, index: number) =>
                    !chat?.isGroup &&
                    !selectedChat?.members.some(
                      (member) => member?._id === chat?.members[0]?._id
                    ) && (
                      <li
                        key={index}
                        className="p-2 hover:theme-secondary dark:hover:theme-dark-secondary border-b last:border-b-0 flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          className="w-full flex-1 flex items-center justify-start gap-2"
                          onClick={async () => {
                            const chatRes = await getChat(
                              chat?.members[0]?._id
                            );

                            if (chatRes?.success) {
                              setSelectedChat(chatRes.chat);
                            }
                          }}
                        >
                          <Image
                            src={
                              chat?.members[0]?.avatar?.url ?? "/noavatar.png"
                            }
                            alt="DP"
                            width={32}
                            height={32}
                            quality={100}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <p>{chat?.members[0]?.username}</p>
                        </Button>
                        <Button
                          size={"sm"}
                          variant={"secondary"}
                          disabled={loading}
                          className="z-10"
                          onClick={() => handleAddMember(chat?.members[0]?._id)}
                        >
                          Add
                        </Button>
                      </li>
                    )
                )}
              </ul>
            </div>
          ) : (
            <div className="w-full text-center">
              <p>You have no chats yet.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
