import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  login: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  password: { type: mongoose.Schema.Types.String, required: true },
  name: { type: mongoose.Schema.Types.String, required: true },
  name: { type: mongoose.Schema.Types.String, required: true },
  userImg: { type: mongoose.Schema.Types.String, required: true },
  nfts: { type: mongoose.Schema.Types.Mixed, required: true },
});

export const User = mongoose.model("User", UserSchema);
