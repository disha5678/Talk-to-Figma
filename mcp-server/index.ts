import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import bodyParser from "body-parser";
import { getNodeSchemaFromPrompt } from "./modelAdapter";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 3001;

// Store all WebSocket clients
const clients: Set<WebSocket> = new Set();

wss.on("connection", (ws) => {
console.log("Client connected via WebSocket");
clients.add(ws);

ws.on("close", () => {
console.log("Client disconnected");
clients.delete(ws);
});
});

// Parse JSON bodies
app.use(bodyParser.json());

// POST /generate
app.post("/generate", async (req, res) => {
const { prompt } = req.body;

if (!prompt) {
return res.status(400).json({ error: "Missing prompt" });
}

try {
const schema = await getNodeSchemaFromPrompt(prompt);


// Broadcast to all connected clients
const payload = JSON.stringify({ type: "generated", prompt, schema });
for (const client of clients) {
  if (client.readyState === client.OPEN) {
    client.send(payload);
  }
}

return res.json({ status: "broadcasted", schema });
} catch (err) {
console.error("Error in /generate:", err);
return res.status(500).json({ error: "Failed to generate node schema" });
}
});

server.listen(PORT, () => {
console.log(MCP server listening on http://localhost:${PORT});
});