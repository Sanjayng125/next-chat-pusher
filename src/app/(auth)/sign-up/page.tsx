"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { RegisterSchema } from "@/schemas/zodSchemas";

export default function Signup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });
      const resData = await res.json();

      if (!resData?.success) {
        if (
          resData?.message?.toLocaleLowerCase().includes("email already taken!")
        ) {
          toast({
            title: "Signup failed",
            description: "Email already taken!",
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Signup failed",
            description: "Something went wrong",
            variant: "destructive",
            duration: 3000,
          });
        }
      }

      if (resData?.success) {
        toast({
          title: "Signup successful",
          variant: "default",
          duration: 3000,
        });
        router.push("/sign-in");
      }
    } catch (error) {
      console.log("Catch Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-w-[350px] lg:min-w-[460px] max-md:w-full h-full p-2 flex flex-col justify-center items-center overflow-y-auto">
      <div className="flex flex-col justify-center items-center max-md:shadow-2xl max-md:rounded-lg max-md:border max-md:p-3 max-md:w-4/5 w-full max-md:max-w-[460px]">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Join NextChat
          </h1>
          <p className="mb-4">Sign-Up to start connecting with peoples</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?
            <Link href={"/sign-in"} className="text-blue-600">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
