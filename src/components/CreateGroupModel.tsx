"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMyStore } from "@/context/ZustandStore";
import { ChatProps } from "@/types";
import { Loader2, PlusIcon } from "lucide-react";
import { useRef, useState } from "react";
import Pill from "./Pill";
import { toast } from "./ui/use-toast";
import { createGroup, getMyChats } from "@/lib/actions";

export function CreateGroupModel() {
  const state = useMyStore();
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<ChatProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMembersSet, setSelectedMembersSet] = useState(
    new Set<string>()
  );
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const handleRemoveUser = (user: ChatProps) => {
    const updatedUsers = selectedMembers.filter(
      (sUser) => sUser?._id !== user?._id
    );
    setSelectedMembers(updatedUsers);

    const updatedIds = new Set(selectedMembersSet);

    updatedIds.delete(user.members[0]._id.toString());
    setSelectedMembersSet(updatedIds);
  };

  const handleCreateGroup = async () => {
    if (selectedMembersSet.size === 0 || groupName === "") {
      toast({
        description: "Please fill all the fields.",
        duration: 3000,
        variant: "default",
      });
      return;
    }
    if (selectedMembersSet.size < 2) {
      toast({
        description: "Please select at least 2 members.",
        duration: 3000,
        variant: "default",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await createGroup(groupName, Array.from(selectedMembersSet));

      if (res?.success) {
        toast({
          description: "Group created successfully!",
          duration: 3000,
          variant: "default",
        });
        setGroupName("");
        setSelectedMembers([]);
        setSelectedMembersSet(new Set<string>());
        state.setSelectedChat(res.chat);

        const reFetchChats = await getMyChats();

        if (reFetchChats.success) {
          state.setMyChats(reFetchChats.chats);
        }
        closeRef?.current?.click();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild ref={closeRef}>
        <Button variant="outline" className="w-full p-1">
          Group <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Add 2 or more members to create a group chat.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="w-full flex items-center justify-between gap-4">
            <Label htmlFor="name" className="">
              Group Name
            </Label>
            <Input
              id="name"
              placeholder="Group Name"
              disabled={loading}
              className="flex-1"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="name" className="">
              Members:
            </Label>
            {selectedMembers.length > 0 && (
              <div className="grid grid-cols-3 max-[360px]:grid-cols-2 max-[250px]:grid-cols-1 gap-2">
                {selectedMembers.map((member, index) => (
                  <Pill
                    image={member?.members[0]?.avatar?.url}
                    text={member?.members[0]?.username}
                    onClick={() => handleRemoveUser(member)}
                    key={index}
                  />
                ))}
              </div>
            )}
          </div>
          {state.myChats?.length > 0 ? (
            <div className="w-full">
              <ul className="w-full max-h-48 overflow-y-auto border-2 rounded">
                {state.myChats.map(
                  (chat: ChatProps, index: number) =>
                    !chat?.isGroup &&
                    !selectedMembersSet.has(
                      chat.members[0]?._id.toString()
                    ) && (
                      <li
                        key={index}
                        className="p-2 hover:theme-secondary dark:hover:theme-dark-secondary border-b last:border-b-0"
                      >
                        <button
                          className="w-full text-left"
                          disabled={loading}
                          onClick={() => {
                            setSelectedMembersSet(
                              new Set([
                                ...selectedMembersSet,
                                chat.members[0]._id.toString(),
                              ])
                            );
                            setSelectedMembers([...selectedMembers, chat]);
                          }}
                        >
                          {chat.members[0]?.username}
                        </button>
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
        <DialogFooter>
          <Button onClick={handleCreateGroup} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
