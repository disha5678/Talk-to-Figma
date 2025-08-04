// mcp-server/index.ts

import express from "express";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import cors from "cors";
const { getModelResponse } = require("./modelAdapter");
import { addMessage, getContext, clearContext } from "./contextManager";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Store connected WebSocket clients
import type { WebSocket } from "ws";
const clients: Set<WebSocket> = new Set();

// 🚀 WebSocket Server
const server = app.listen(PORT, () =>
  console.log(`MCP Server running on port ${PORT}`)
);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  const clientId = Date.now().toString();
  console.log("WebSocket connected:", clientId);
  clients.add(ws);

  ws.on("message", async (message) => {
    const prompt = message.toString();
    console.log(`Prompt from ${clientId}:`, prompt);

    // Save to memory
    addMessage(clientId, "user", prompt);

    // Get model output
    const figmaSchema = await getModelResponse(getContext(clientId));

    // Save AI response
    addMessage(clientId, "assistant", JSON.stringify(figmaSchema));

    // Send back only to this client
    ws.send(JSON.stringify(figmaSchema));
  });

  ws.on("close", () => {
    console.log("WebSocket disconnected:", clientId);
    clearContext(clientId);
    clients.delete(ws);
  });
});

// 📌 REST Endpoint for /generate (optional for HTTP clients)
import type { Request, Response } from "express";


app.post("/generate", async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  // TEMP clientId for HTTP
  const clientId = "http_" + Date.now();
  addMessage(clientId, "user", prompt);

  const figmaSchema = await getModelResponse(getContext(clientId));
  addMessage(clientId, "assistant", JSON.stringify(figmaSchema));

  // Broadcast to all WebSocket clients (e.g., Figma & Web UI)
  for (const client of clients) {
    client.send(JSON.stringify(figmaSchema));
  }

  res.json({ figmaSchema });
});