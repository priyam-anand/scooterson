import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokenHash: {
    type: String,
    require: false,
  },
  role: {
    type: String,
    enum: ["ADMIN", "OPERATOR", "USER"],
    default: "USER",
  },
});

export const User = mongoose.model("User", userSchema);
