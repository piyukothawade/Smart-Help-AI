import Ticket from "../models/Ticket.js";
import { classifyTicket, generateReply } from "../services/aiService.js";

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
// Create or continue a widget ticket using a tenant ID.
export const createWidgetTicket = async (req, res) => {
  try {
    const rawMessage = req.body.message || req.body.title;
    const message = typeof rawMessage === "string" ? rawMessage.trim() : "";
    const visitorId =
      typeof req.body.visitorId === "string" ? req.body.visitorId.trim() : "";

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let aiData = { priority: "low", category: "other" };

    try {
      aiData = await classifyTicket(message);
    } catch (err) {
      console.log("AI classification failed for widget ticket");
    }

    let ticket = await Ticket.findOne({
      source: "widget",
      visitorId,
      tenantId: req.widget.tenantId,
      status: "open",
    }).sort({ createdAt: -1 });

    if (ticket) {
      ticket.messages.push({
        sender: "user",
        text: message,
        createdAt: new Date(),
      });

      await ticket.save();

      if (global.io) {
        global.io.emit("ticketUpdated", ticket);
      }
    } else {
      ticket = await Ticket.create({
        title: message.slice(0, 80),
        source: "widget",
        visitorId,
        tenantId: req.widget.tenantId,
        user: req.widget.userId,
        priority: aiData.priority,
        category: aiData.category,
        status: "open",
        messages: [
          {
            sender: "user",
            text: message,
          },
        ],
      });

      if (global.io) {
        global.io.emit("ticketCreated", ticket);
      }
    }

    const reply = await generateReply(message);

    ticket.messages.push({
      sender: "bot",
      text: reply,
      createdAt: new Date(),
    });

    await ticket.save();

    if (global.io) {
      global.io.emit("ticketUpdated", ticket);
    }

    res.status(201).json({
      success: true,
      reply,
      ticket,
      ticketId: ticket._id,
    });
  } catch (err) {
    console.error("Widget ticket create error:", err);
    res.status(500).json({
      success: false,
      message: "Error creating widget ticket",
    });
  }
};

// âœ… GET ALL TICKETS
export const getTickets = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { user: req.user.id };

    const tickets = await Ticket.find(query)
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
    const query = { _id: req.params.id };
    if (req.user.role !== "admin") query.user = req.user.id;

    const ticket = await Ticket.findOne(query).populate("user", "name email");

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

    const query = { _id: req.params.id };
    if (req.user.role !== "admin") query.user = req.user.id;

    const ticket = await Ticket.findOne(query);

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

    const query = { _id: req.params.id };
    if (req.user.role !== "admin") query.user = req.user.id;

    const ticket = await Ticket.findOne(query);

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
