import { Router } from "express";
import {
  login,
  register,
  addToHistory,
  getUserHistory
} from "../controllers/user.controller.js";

const router = Router();

// Auth Routes
router.post("/login", login);
router.post("/register", register);

// Meeting History Routes
router.post("/add-to-history", addToHistory);
router.get("/get-history", getUserHistory);

export default router;
// Exporting the router for use in the main app