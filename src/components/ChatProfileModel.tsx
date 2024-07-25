"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Edit2, Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { useMyStore } from "@/context/ZustandStore";
import { deleteGroupChat, getChat, getMyChats } from "@/lib/actions";
import { ManageMembersModel } from "./ManageMembersModel";
import { Alert } from "./Alert";

export function ChatProfileModel() {
  const { data: session } = useSession();
  const { selectedChat, setSelectedChat, setMyChats, members } = useMyStore();
  const [updateGroup, setUpdateGroup] = useState(false);
  const [groupName, setGroupName] = useState(
    (selectedChat?.isGroup && selectedChat?.groupName) || ""
  );
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isActive = members.indexOf(selectedChat?.members[0].email!) !== -1;

  const handleGroupNameChange = async () => {
    if (selectedChat?.isGroup) {
      setLoading(true);
      try {
        let base64Image = null;
        if (newAvatar !== null) {
          const reader = new FileReader();
          const convertToBase64 = (img: File) => {
            reader.readAsDataURL(img);
            return new Promise((resolve, reject) => {
              reader.onload = () => {
                resolve(reader.result);
              };
              reader.onerror = () => {
                reject(null);
              };
            });
          };
          base64Image = await convertToBase64(newAvatar);
        }

        const res = await fetch("/api/group/updateGroup", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: selectedChat._id,
            groupName,
            groupImg: base64Image,
          }),
        });
        const data = await res.json();

        toast({
          title: data.success ? "Success" : "Error",
          description: data.message,
          variant: data.success ? "default" : "destructive",
          duration: 3000,
        });

        if (data.success) {
          setUpdateGroup(false);
          setSelectedChat(data.chat);
          const res = await getMyChats();

          if (res.success) {
            setMyChats(res.chats);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteGroupChat = async () => {
    if (selectedChat?.isGroup) {
      const res = await deleteGroupChat(selectedChat?._id);
      if (res.success) {
        toast({
          title: "Success",
          description: "Group chat deleted successfully",
          variant: "default",
          duration: 3000,
        });
        setSelectedChat(null);
        const chatsRes = await getMyChats();

        if (chatsRes.success) {
          setMyChats(chatsRes.chats);
        }
      }
    }
  };

  return (
    <Dialog onOpenChange={(e) => e === false && setUpdateGroup(false)}>
      <DialogTrigger asChild>
        <button className="flex items-center">
          <Image
            src={
              (selectedChat?.isGroup
                ? selectedChat?.groupImg?.url
                : selectedChat?.members[0]?.avatar?.url) ?? "/noavatar.png"
            }
            alt="DP"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="ml-2 flex flex-col text-xl font-medium items-start">
            {selectedChat?.isGroup
              ? selectedChat?.groupName
              : selectedChat?.members[0]?.username}
            {isActive && !selectedChat?.isGroup ? (
              <span className="text-xs text-green-500 font-semibold">
                Online
              </span>
            ) : !selectedChat?.isGroup ? (
              <span className="text-xs text-gray-500 font-semibold">
                Offline
              </span>
            ) : null}
          </p>
        </button>
      </DialogTrigger>
      {/* if Chat is group */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="w-full flex flex-col items-center gap-2">
            <Input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden my-2"
              onChange={(e) =>
                e.target.files !== null &&
                e.target.files[0].type.startsWith("image/") &&
                setNewAvatar(e?.target?.files[0])
              }
            />
            <button
              disabled={!updateGroup}
              className="w-full max-w-60 max-xsm:max-w-40 aspect-square rounded-full flex items-center justify-center overflow-hidden relative"
              onClick={() => inputRef.current?.click()}
            >
              <Image
                src={
                  (newAvatar && URL.createObjectURL(newAvatar)) ||
                  (selectedChat?.isGroup
                    ? selectedChat?.groupImg?.url
                    : selectedChat?.members[0]?.avatar?.url) ||
                  "/noavatar.png"
                }
                width={100}
                height={100}
                quality={100}
                priority
                alt="DP"
                className="w-full max-w-60 max-xsm:max-w-40 aspect-square rounded-full border-2 object-cover"
              />
              {updateGroup && (
                <p className="absolute bottom-0 bg-blue-600 text-white w-full h-10 flex items-center justify-center">
                  Choose
                </p>
              )}
            </button>
            <DialogTitle>
              {selectedChat?.isGroup ? (
                <div className="flex items-center gap-2">
                  {!updateGroup ? (
                    <>
                      <p className="font-semibold">{selectedChat?.groupName}</p>
                      {session?.user?._id === selectedChat?.groupAdmin?._id && (
                        <button onClick={() => setUpdateGroup(true)}>
                          <Edit2 className="w-4 h-4 text-theme-secondary dark:text-theme-dark-secondary" />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <Input
                        placeholder="New Group Name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        disabled={loading}
                      />
                      <Button
                        onClick={() => {
                          setUpdateGroup(false);
                          setGroupName(selectedChat?.groupName ?? "");
                          setNewAvatar(null);
                        }}
                        variant="outline"
                        disabled={loading}
                      >
                        <X className="w-4 h-4 text-theme-secondary dark:text-theme-dark-secondary" />
                      </Button>
                      <Button
                        onClick={handleGroupNameChange}
                        disabled={
                          loading ||
                          (groupName.length < 3 && !newAvatar) ||
                          (groupName === selectedChat?.groupName && !newAvatar)
                        }
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4 text-theme-secondary dark:text-theme-dark-secondary" />
                        )}
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                selectedChat?.members[0]?.username
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedChat?.isGroup
                ? `Created by ${selectedChat?.groupAdmin?.username?.slice(
                    0,
                    35
                  )}`
                : selectedChat?.members[0]?.email?.slice(0, 35)}
            </DialogDescription>
            {selectedChat?.isGroup &&
              session?.user?._id === selectedChat?.groupAdmin?._id && (
                <Alert
                  loading={loading}
                  title="Are you sure?"
                  description="You going to delete this group chat. This action is irreversible!."
                  btnText="Delete"
                  btnType="destructive"
                  cmfrmBtnText="Delete"
                  onClick={handleDeleteGroupChat}
                />
              )}
          </div>
        </DialogHeader>
        {/* if Chat is group */}
        {selectedChat?.isGroup && (
          <div className="w-full">
            <div className="flex justify-between items-center my-2">
              <p className="font-semibold">
                Members: {selectedChat?.members?.length + 1}
              </p>
              {session?.user?._id === selectedChat?.groupAdmin?._id && (
                <ManageMembersModel />
              )}
            </div>
            <ul className="w-full max-h-48 overflow-y-auto border-2 rounded">
              <li className="p-2 hover:theme-secondary dark:hover:theme-dark-secondary border-b last:border-b-0 flex items-center gap-2 cursor-not-allowed">
                <Image
                  src={session?.user?.avatar?.url ?? "/noavatar.png"}
                  alt="DP"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p>You</p>
              </li>
              {selectedChat?.members?.map((member, index) => (
                <li
                  key={index}
                  className="border-b last:border-b-0 flex items-center gap-2 cursor-pointer"
                >
                  <button
                    className="w-full p-2 flex items-center justify-start gap-2 hover:theme-secondary dark:hover:theme-dark-secondary"
                    disabled={loading}
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
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <p>{member?.username}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
