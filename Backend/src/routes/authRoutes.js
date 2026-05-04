import express from "express";
import {
  createTenantId,
  loginUser,
  registerUser,
} from "../controller/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/tenant-id", protect, createTenantId);

export default router;
