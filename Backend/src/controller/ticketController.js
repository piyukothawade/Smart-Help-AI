import Ticket from "../models/Ticket.js";
import { classifyTicket } from "../services/aiService.js";

// ✅ CREATE TICKET (AI + REALTIME)
export const createTicket = async (req, res) => {
  try {
    const { title } = req.body;

    // 🤖 AI classification
    let aiData = { priority: "low", category: "other" };

    try {
      aiData = await classifyTicket(title);
    } catch (err) {
      console.log("AI classification failed, using defaults");
    }

    const ticket = await Ticket.create({
      title,
      user: req.user.id,
      priority: aiData.priority,
      category: aiData.category,
      status: "open",
      messages: [
        {
          sender: "user",
          text: title,
        },
      ],
    });

    // 🔥 REAL-TIME
    if (global.io) {
      global.io.emit("ticketCreated", ticket);
    }

    res.status(201).json(ticket);

  } catch (err) {
    res.status(500).json({ message: "Error creating ticket" });
  }
};

// ✅ GET ALL TICKETS
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tickets" });
  }
};

// ✅ GET SINGLE TICKET
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ticket" });
  }
};

// ✅ ADD REPLY
export const addReply = async (req, res) => {
  try {
    const { text } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const message = {
      sender: req.user.role === "admin" ? "admin" : "user",
      text,
      createdAt: new Date(),
    };

    ticket.messages.push(message);

    await ticket.save();

    // 🔥 REAL-TIME
    if (global.io) {
      global.io.emit("ticketUpdated", ticket);
    }

    res.json(ticket);

  } catch (err) {
    res.status(500).json({ message: "Error adding reply" });
  }
};

// ✅ UPDATE STATUS
export const updateTicket = async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status || ticket.status;

    await ticket.save();

    // 🔥 REAL-TIME
    if (global.io) {
      global.io.emit("ticketUpdated", ticket);
    }

    res.json(ticket);

  } catch (err) {
    res.status(500).json({ message: "Error updating ticket" });
  }
};