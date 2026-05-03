import mongoose from "mongoose";

const ticketSchema = mongoose.Schema(
  {
    title: String,
    status: { type: String, default: "open" },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 🔥 NEW: conversation history
    messages: [
      {
        sender: { type: String }, // "user" | "admin"
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);