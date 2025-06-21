import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },

  password: { type: String, required: true },
  token: { type: String, default: null },
});
const User = mongoose.model("User", userSchema);
export default User;
