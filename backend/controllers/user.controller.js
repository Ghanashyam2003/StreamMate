import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";

const SALT_ROUNDS = 10;          // how strong the bcrypt hash should be

/* -----------------------------  LOGIN  ----------------------------- */
export const login = async (req, res) => {
  const { username, password } = req.body ?? {};

  /* 1. basic checks */
  if (!username || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "username and password required" });
  }

  try {
    /* 2. find user */
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "user not found" });
    }

    /* 3. verify password */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "invalid credentials" });
    }

    /* 4. create & store session token (swap for JWT later) */
    const token = crypto.randomBytes(20).toString("hex");
    await User.updateOne({ _id: user._id }, { $set: { token } });

    return res.status(httpStatus.OK).json({ token });
  } catch (err) {
    console.error("login-error:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "internal server error" });
  }
};

/* ---------------------------  REGISTER  ---------------------------- */
export const register = async (req, res) => {
  const { name, username, password } = req.body ?? {};

  if (!name || !username || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "name, username, password required" });
  }

  try {
    /* avoid duplicate usernames */
    const usernameTaken = await User.exists({ username });
    if (usernameTaken) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await User.create({ name, username, password: hashedPassword });

    return res
      .status(httpStatus.CREATED)
      .json({ message: "user registered" });
  } catch (err) {
    console.error("register-error:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "internal server error" });
  }
};

/* -----------------------  USER-MEETING HISTORY  -------------------- */
export const getUserHistory = async (req, res) => {
  const { token } = req.query ?? {};

  if (!token) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "token required" });
  }

  try {
    const user = await User.findOne({ token }).lean();
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "invalid token" });
    }

    const meetings = await Meeting.find({ user_id: user.username }).lean();
    return res.status(httpStatus.OK).json(meetings);
  } catch (err) {
    console.error("history-error:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "internal server error" });
  }
};

/* --------------------------  ADD HISTORY  -------------------------- */
export const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body ?? {};

  if (!token || !meeting_code) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "token and meeting_code required" });
  }

  try {
    const user = await User.findOne({ token }).lean();
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "invalid token" });
    }

    await Meeting.create({
      user_id: user.username,
      meetingCode: meeting_code
    });

    return res
      .status(httpStatus.CREATED)
      .json({ message: "meeting added to history" });
  } catch (err) {
    console.error("add-history-error:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "internal server error" });
  }
};
