import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { verifyPassword } from "./lib";
import { UserModel } from "./models";
import { connectToDb } from "./db";

const providers = [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: {
                label: "Email",
                type: "text",
                placeholder: "Email",
            },
            password: {
                label: "Password",
                type: "password",
                placeholder: "Password",
            },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                return null
            } else {
                await connectToDb();
                if (!credentials.email || !credentials.password) {
                    return null
                }

                const user = await UserModel.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("User not found!");
                }

                const isPasswordCorrect = await verifyPassword(
                    credentials.password.toString(),
                    user?.password
                );

                if (!isPasswordCorrect) {
                    throw new Error("Incorrect password");
                }

                const { password: pass, ...rest } = user._doc; //deselcting password to send user(this will send all data accept password)

                return rest;
            }
        },
    }),
]

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: providers,
    callbacks: {
        ...authConfig.callbacks
    },
});
