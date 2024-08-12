"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { SearchIcon } from "lucide-react";
import Search from "./Search";
import { useMyStore } from "@/context/ZustandStore";
import { useEffect, useRef, useState } from "react";

export function SearchModel() {
  const { selectedChat } = useMyStore();
  const [isOpen, setIsOpen] = useState(false);
  const closeModelRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) closeModelRef?.current?.click();
  }, [selectedChat]);

  return (
    <Dialog>
      <DialogTrigger
        asChild
        onClick={() => setIsOpen(true)}
        className="cursor-pointer"
      >
        <SearchIcon />
      </DialogTrigger>
      <DialogClose ref={closeModelRef} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="w-full flex justify-center items-center gap-2">
          Search for users, groups, and chats
        </DialogTitle>
        <Search />
      </DialogContent>
    </Dialog>
  );
}
