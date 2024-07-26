"use server";
import Redis from "ioredis";
import { auth } from "./auth";

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
});

export const setNotificationsToRedis = async (notifications: { chatId: string, message: string, createdAt: string, count: number }[]) => {
    const session = await auth()
    if (session?.user) {
        const res = await redis.set(`notifications:${session?.user._id}`, JSON.stringify(notifications))
        return res
    }
    return null
}

export const getNotificationsFromRedis = async () => {
    const session = await auth()
    if (session?.user) {
        const res = await redis.get(`notifications:${session?.user._id}`)

        if (res === null || res === "nil") {
            return []
        }

        return JSON.parse(res)
    }
    return null
}