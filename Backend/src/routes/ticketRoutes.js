import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getTickets,
  createTicket,
  getTicketById,
  addReply,
  updateTicket,
} from "../controller/ticketController.js";

const router = express.Router();

router.get("/", protect, getTickets);
router.post("/", protect, createTicket);

// 🔥 NEW ROUTES
router.get("/:id", protect, getTicketById);
router.post("/:id/reply", protect, addReply);
router.put("/:id", protect, updateTicket);

export default router;