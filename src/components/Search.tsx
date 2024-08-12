"use client";
import { useMyStore } from "@/context/ZustandStore";
import { getChat, getMyChats } from "@/lib/actions";
import { UserProps } from "@/types";
import { Loader2, SearchIcon, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Search = () => {
  const state = useMyStore();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    setLoading(true);
    setSearchResults([]);
    try {
      const res = await fetch(`/api/user?search=${searchInput}`);
      const data = await res.json();

      if (data?.success) {
        setSearchResults(data.users);
      }
    } catch (error) {
      console.log("Error while searching: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (user_id: string) => {
    const chatRes = await getChat(user_id);

    if (chatRes?.success) {
      state.setSelectedChat(chatRes.chat);
      setSearchInput("");
      setSearchResults([]);
      const res = await getMyChats();
      state.setMyChats(res?.chats);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center gap-2 border-2 rounded-md border-black border-opacity-10 dark:border-white dark:border-opacity-30 p-1 m-2 relative">
      <div className="w-full h-max flex items-center relative">
        <input
          type="text"
          className="outline-none w-full dark:bg-transparent p-1"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && !loading && getUsers()}
        />
        <button
          className="text-2xl hover:scale-95 absolute right-2 top-1/2 -translate-y-1/2"
          onClick={getUsers}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : <SearchIcon />}
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className="w-full h-full flex flex-col gap-2 border-2 rounded-md overflow-x-hidden max-h-60 overflow-y-auto bg-white dark:bg-slate-900 p-1">
          <div className="flex items-center justify-between px-2 py-1 border-b-2">
            <p>Search Results</p>
            <button onClick={() => setSearchResults([])}>
              <X />
            </button>
          </div>
          {searchResults.map((res, i) => (
            <button
              className="hover:theme-secondary dark:hover:theme-dark-secondary p-1 flex items-center gap-2 rounded-lg"
              onClick={() => handleClick(res._id)}
              key={i}
            >
              <Image
                src={res.avatar.url ?? "/noavatar.png"}
                alt="DP"
                width={40}
                height={40}
                className="w-8 h-8 rounded-full object-cover"
              />
              <p>{res?.username}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
