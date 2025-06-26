import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    token: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt fields automatically
  }
);

const User = mongoose.model("User", userSchema);

export { User };
