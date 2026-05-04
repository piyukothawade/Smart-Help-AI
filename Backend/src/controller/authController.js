import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: email === "admin@gmail.com" ? "admin" : "user",
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
    token: generateToken(user._id, user.role),
  });
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

export const createTenantId = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.tenantId) {
      user.tenantId = crypto.randomUUID();
      await user.save();
    }

    res.json({
      tenantId: user.tenantId,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating tenant ID" });
  }
};
