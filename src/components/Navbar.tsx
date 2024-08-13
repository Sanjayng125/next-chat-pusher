"use client";

import { signOut, useSession } from "next-auth/react";
import React from "react";
import ThemeSwitch from "./ThemeSwitch";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Loader2, Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { CreateGroupModel } from "./CreateGroupModel";
import { ProfileModel } from "./ProfileModel";
import { SearchModel } from "./SearchModel";

export default function Navbar() {
  const { data: session, status } = useSession();
  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/sign-in" });
  };
  return (
    <div className="flex items-center justify-between p-3 border-b-2 gap-2 z-50 h-16">
      <h1 className="text-2xl font-bold">NextChat</h1>
      <div className="flex items-center gap-2">
        {session?.user && status === "authenticated" && <SearchModel />}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="border p-2">
                <Menu className="w-5 h-5" />
              </NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col items-center gap-1 p-2">
                <ThemeSwitch />
                {session?.user && (
                  <>
                    <CreateGroupModel />
                    <button
                      onClick={logout}
                      className="w-full bg-red-600 text-white rounded hover:underline p-1"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {session?.user && status === "authenticated" ? (
          <ProfileModel />
        ) : status === "unauthenticated" ? (
          <>
            <Link href="/sign-in">Sign-In</Link>
          </>
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </div>
    </div>
  );
}
