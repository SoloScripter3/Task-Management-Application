import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
