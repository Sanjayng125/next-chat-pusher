import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({ message: "Enter a valid email" }),
    password: z.string().min(5, { message: "Password length must be at least 5 charecters" }).max(20, { message: "Password can't be longer than 20 charecters" })
})

export const RegisterSchema = z.object({
    username: z.string().min(3, { message: "Username length must be at least 3 charecters long" }).max(20, { message: "Username can't be longer than 20 charecters" }),
    email: z.string().email({ message: "Enter a valid email" }),
    password: z.string().min(5, { message: "Password length must be at least 5 charecters long" }).max(20, { message: "Password can't be longer than 20 charecters" })
})

export const ChatNameSchema = z.object({
    name: z.string().min(3, { message: "Name length must be at least 3 charecters long" }).max(20, { message: "Username can't be longer than 20 charecters" }),
    email: z.string().email({ message: "Enter a valid email" }),
})