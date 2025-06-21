import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this in production
    methods: ["GET", "POST"],
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Environment-based configuration
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

// Test Route
app.get("/home", (req, res) => {
  return res.json({
    message: "Welcome to the home page!",
  });
});

// Start server and connect to MongoDB
const start = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" MongoDB Connected");

    server.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(" MongoDB connection error:", err);
  }
};

start();
