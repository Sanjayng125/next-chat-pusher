"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return;

  if (resolvedTheme === "dark") {
    return (
      <div className="w-full flex items-center justify-between space-x-2 border-2 rounded-2xl p-[2px] cursor-pointer">
        <Switch
          id="airplane-mode"
          onClick={() => setTheme("light")}
          checked={resolvedTheme === "dark"}
        />
        <Label htmlFor="airplane-mode" className="cursor-pointer">
          <Sun />
        </Label>
      </div>
    );
  }
  if (resolvedTheme === "light") {
    return (
      <div className="w-full flex items-center justify-between space-x-2 border-2 rounded-2xl p-[2px] cursor-pointer">
        <Switch
          id="airplane-mode"
          onClick={() => setTheme("dark")}
          checked={resolvedTheme !== "light"}
        />
        <Label htmlFor="airplane-mode" className="cursor-pointer">
          <Moon />
        </Label>
      </div>
    );
  }
};

export default ThemeSwitch;
