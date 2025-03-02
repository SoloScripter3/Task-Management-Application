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

export const setWithExpiry = async (key, value, expiryTime = 300) => {
  await redisClient.set(key, JSON.stringify(value), { EX: expiryTime });
};

export const getData = async (key) => {
  const data = await redisClient.get(key);
  return JSON.parse(data);
};

export const deleteData = async (key) => {
  await redisClient.del(key);
};

connectRedisDB();

export default redisClient;
