import { Redis } from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
});

export default redis;