import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis error: ", err));

const connectRedisDB = async () => {
  try {
    await redisClient.connect();

    console.log("connected to upstash redis");
  } catch (err) {
    console.log("Redis connection error:", err);
    setTimeout(connectRedisDB, 5000);
  }
};
