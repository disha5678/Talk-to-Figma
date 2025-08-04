const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:3000");

ws.on("open", () => {
  console.log("Connected to MCP WebSocket");
  ws.send("Create a Figma button with label Submit");
});

ws.on("message", (message) => {
  console.log("Response from server:", message.toString());
});