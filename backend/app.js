import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/user.routes.js";

// Load .env variables
dotenv.config();

const app = express();
const server = createServer(app);

// Socket.io setup
const io = connectToSocket(server);

// Express configuration
app.set("port", process.env.PORT || 8000);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

// Routes
app.use("/api/v1/users", userRoutes);

// MongoDB Connection & Server Start
const start = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "streammate",   
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ MongoDB Connected: ${db.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`🚀 Server running on port ${app.get("port")}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit with failure
  }
};

start();
