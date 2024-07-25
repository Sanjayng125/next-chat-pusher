import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/AuthProvider";
import Navbar from "@/components/Navbar";
import { ThemeProviders } from "@/context/ThemeProvider";
import ActiveStatus from "@/components/ActiveStatus";

export const metadata: Metadata = {
  title: "NextChat",
  description:
    "A Realtime chat app built with Next.js, React, and Tailwind CSS, Socket.io, and MongoDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full flex justify-center h-dvh max-h-screen md:p-5 bg-white dark:bg-black">
        <AuthProvider>
          <ThemeProviders>
            <div className="w-full max-w-7xl flex flex-col text-black dark:text-white md:shadow-2xl md:rounded-lg md:border-2">
              <Navbar />
              <div className="flex-1 w-full h-[calc(100vh-104px)] flex">
                <ActiveStatus />
                {children}
              </div>
            </div>
            <Toaster />
          </ThemeProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
