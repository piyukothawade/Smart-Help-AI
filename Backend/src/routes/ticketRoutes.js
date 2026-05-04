import express from "express";
import protect from "../middleware/authMiddleware.js";
import widgetAuth from "../middleware/aiWidget.middleware.js";

import {
  getTickets,
  createTicket,
  createWidgetTicket,
  getTicketById,
  addReply,
  updateTicket,
} from "../controller/ticketController.js";

const router = express.Router();

router.get("/", protect, getTickets);
router.post("/", protect, createTicket);
router.post("/widget", widgetAuth, createWidgetTicket);

// 🔥 NEW ROUTES
router.get("/:id", protect, getTicketById);
router.post("/:id/reply", protect, addReply);
router.put("/:id", protect, updateTicket);

export default router;
