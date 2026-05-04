import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";

import { Server } from "socket.io";
import aiRoutes from "./routes/aiRoutes.js";
import Ticket from "./models/Ticket.js";
import { generateReply, classifyTicket } from "./services/aiService.js";
import { validateWidgetTenantId } from "./middleware/aiWidget.middleware.js";

// dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running on ${PORT}`)
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

global.io = io;

const normalizeTenantId = (tenantId) =>
  typeof tenantId === "string" ? tenantId.trim() : "";

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("widget:join", async ({ apiKey, tenantId, visitorId } = {}, callback) => {
    const activeTenantId = normalizeTenantId(tenantId || apiKey);
    const tenantUser = await validateWidgetTenantId(activeTenantId);

    if (!tenantUser) {
      callback?.({ ok: false, message: "Invalid tenant ID" });
      socket.disconnect(true);
      return;
    }

    socket.data.widget = {
      tenantId: activeTenantId,
      userId: tenantUser._id,
      visitorId: visitorId || socket.id,
    };

    callback?.({
      ok: true,
      visitorId: socket.data.widget.visitorId,
    });
  });

  socket.on("widget:message", async ({ message, visitorId } = {}, callback) => {
    try {
      if (!socket.data.widget) {
        callback?.({ ok: false, message: "Widget is not connected" });
        return;
      }

      const text = typeof message === "string" ? message.trim() : "";
      if (!text) {
        callback?.({ ok: false, message: "Message is required" });
        return;
      }

      const activeVisitorId = visitorId || socket.data.widget.visitorId;
      const userMessage = {
        sender: "user",
        text,
        createdAt: new Date(),
      };

      let ticket = await Ticket.findOne({
        visitorId: activeVisitorId,
        source: "widget",
        tenantId: socket.data.widget.tenantId,
        status: "open",
      }).sort({ createdAt: -1 });

      if (!ticket) {
        let aiData = { priority: "low", category: "other" };

        try {
          aiData = await classifyTicket(text);
        } catch {
          console.log("AI classification failed for widget ticket");
        }

        ticket = await Ticket.create({
          title: text.slice(0, 80),
          source: "widget",
          visitorId: activeVisitorId,
          tenantId: socket.data.widget.tenantId,
          user: socket.data.widget.userId,
          priority: aiData.priority,
          category: aiData.category,
          status: "open",
          messages: [userMessage],
        });

        io.emit("ticketCreated", ticket);
      } else {
        ticket.messages.push(userMessage);
        await ticket.save();
        io.emit("ticketUpdated", ticket);
      }

      socket.emit("widget:typing", { typing: true });

      const reply = await generateReply(text);
      const botMessage = {
        sender: "bot",
        text: reply,
        createdAt: new Date(),
      };

      ticket.messages.push(botMessage);
      await ticket.save();

      socket.emit("widget:typing", { typing: false });
      socket.emit("widget:message", botMessage);
      io.emit("ticketUpdated", ticket);

      callback?.({ ok: true, reply, ticketId: ticket._id });
    } catch (err) {
      console.error("Widget socket message error:", err);
      socket.emit("widget:error", { message: "Server error, try again" });
      callback?.({ ok: false, message: "Server error, try again" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});
