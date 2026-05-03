import express from "express";
import { generateReply } from "../services/aiService.js";

const router = express.Router();

router.post("/reply", async (req, res) => {
  const { message } = req.body;

  const reply = await generateReply(message);

  res.json({ reply });
});

export default router;