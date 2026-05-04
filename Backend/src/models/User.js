import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
    tenantId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
