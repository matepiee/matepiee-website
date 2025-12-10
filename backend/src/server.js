import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import pool from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import twitchRoutes from "./routes/twitchRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.BACKEND_PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.use(logger);

app.use("/api/auth", authRoutes);
app.use("/api/twitch", twitchRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on: ${PORT}`);
});
