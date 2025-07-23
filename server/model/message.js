import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      id: { type: mongoose.Schema.ObjectId, ref: "Users", required: true },
      name: { type: String, required: true },
    },
    recipient: {
      id: { type: mongoose.Schema.ObjectId, ref: "Users", required: true },
      name: { type: String, required: true },
    },
    text: { type: String },
  },
  { timestamps: true }
);

export const messageModel = mongoose.model("messages", messageSchema);
