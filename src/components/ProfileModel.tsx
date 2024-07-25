"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert } from "./Alert";
import { updateProfile } from "@/lib/actions";
import { toast } from "./ui/use-toast";

export function ProfileModel() {
  const { data: session, update: updateSession } = useSession();
  const [update, setUpdate] = useState(false);
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [username, setUsername] = useState(session?.user?.username ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let base64Image = null;
      let newPassword = password === "" ? null : password;
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
      if (newPassword && newPassword?.length < 5) {
        toast({
          title: "Error",
          description: "Password must be at least 5 characters long",
          duration: 3000,
          variant: "destructive",
        });
        return;
      }

      const data = await updateProfile(
        username.trim(),
        email.trim(),
        newPassword,
        base64Image
      );

      if (data?.success) {
        setUpdate(false);
        setPassword("");
        setNewAvatar(null);
        await updateSession({
          ...session,
          user: data?.user,
        });
      }
      toast({
        title: data.success ? "Success" : "Error",
        description: data.message,
        duration: 3000,
        variant: data.success ? "default" : "destructive",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(e) => e === false && setUpdate(false)}>
      <DialogTrigger asChild>
        <button className="flex items-center">
          <Image
            src={session?.user?.avatar?.url ?? "/noavatar.png"}
            alt="DP"
            width={40}
            height={40}
            className="w-9 h-9 rounded-full object-cover"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center">
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
            disabled={!update}
            className="w-full max-w-60 max-xsm:max-w-40 aspect-square rounded-full flex items-center justify-center overflow-hidden relative"
            onClick={() => inputRef.current?.click()}
          >
            <Image
              src={
                (newAvatar && URL.createObjectURL(newAvatar)) ??
                session?.user?.avatar?.url ??
                "/noavatar.png"
              }
              alt="DP"
              width={100}
              height={100}
              quality={100}
              priority
              className="w-full h-auto object-cover aspect-square border-2 rounded-full"
            />
            {update && (
              <p className="absolute bottom-0 bg-blue-600 text-white w-full h-10 flex items-center justify-center">
                Choose
              </p>
            )}
          </button>
        </DialogHeader>
        {!update && (
          <div className="w-full flex justify-end">
            <button onClick={() => setUpdate(true)} className="w-max">
              <Edit2 className="w-6 h-6" />
            </button>
          </div>
        )}
        <DialogTitle className="w-full flex justify-center items-center gap-2">
          {!update ? (
            <p>{username}</p>
          ) : (
            <Input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              disabled={loading}
            />
          )}
        </DialogTitle>
        <DialogDescription className="w-full flex justify-center items-center gap-2">
          {!update ? (
            <p>{email?.slice(0, 35)}</p>
          ) : (
            <Input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              value={email}
              disabled={loading}
            />
          )}
        </DialogDescription>
        <DialogDescription className="w-full flex justify-center items-center gap-2 relative">
          {update && (
            <>
              <Input
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                value={password}
                disabled={loading}
              />
              {showPassword ? (
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Eye className="w-6 h-6 absolute top-2/4 -translate-y-2/4 right-4 max-xsm:w-5 max-xsm:h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <EyeOff className="w-6 h-6 absolute top-2/4 -translate-y-2/4 right-4 max-xsm:w-5 max-xsm:h-5" />
                </button>
              )}
            </>
          )}
        </DialogDescription>
        {update && (
          <div className="w-full flex items-center justify-end gap-2">
            <Button
              onClick={() => {
                setUpdate(false);
                setPassword("");
                setNewAvatar(null);
              }}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Alert
              title="Are you sure?"
              description="You going to update your profile."
              btnText="Update"
              btnType="default"
              cmfrmBtnText="Update"
              onClick={handleSubmit}
              loading={
                (session?.user.username === username.trim() &&
                  session?.user?.email === email.trim() &&
                  password === "" &&
                  newAvatar === null) ||
                username === "" ||
                email === "" ||
                loading
              }
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
