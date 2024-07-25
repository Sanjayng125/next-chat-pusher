"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoginSchema } from "@/schemas/zodSchemas";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

export default function Signin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        // if (res.error.toLocaleLowerCase().includes("incorrect password")) {
        //   toast({
        //     title: "Signin failed",
        //     description: "Incorrect Password",
        //     variant: "destructive",
        //   });
        // } else if (res.error.toLocaleLowerCase().includes("user not found!")) {
        //   toast({
        //     title: "Signin failed",
        //     description: "User not found!",
        //     variant: "destructive",
        //   });
        // } else {
        //   toast({
        //     title: "Signin failed",
        //     description: "Something went wrong",
        //     variant: "destructive",
        //   });
        // }
        toast({
          title: "Signin failed",
          description: "Invalid Email or Password",
          variant: "destructive",
          duration: 3000,
        });
      }

      if (res?.url) {
        router.replace("/");
      }
    } catch (error) {
      console.log("Catch Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-w-[350px] lg:min-w-[460px] max-md:w-full p-2 flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center max-md:shadow-2xl max-md:rounded-lg max-md:border max-md:p-3 max-md:w-4/5 w-full max-md:max-w-[460px]">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Welcome Back
          </h1>
          <p className="mb-4">Sign-In to start connecting with peoples</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
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
                "Signin"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member?
            <Link href={"/sign-up"} className="text-blue-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
