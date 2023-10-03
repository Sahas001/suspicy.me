const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => console.log("Server started!"));

// Begin websocket

const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", (ws) => {
  const numClients = wss.clients.size;
  console.log(`New client connected (total: ${numClients})`);

  wss.broadcast(`Current Visitors: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server!");
  }

  ws.on("close", () => {
    console.log("Client disconnected");
    wss.broadcast(`Current Visitors: ${numClients}`);
  });
});

wss.broadcast = function broadcast(msg) {
  wss.clients.forEach(function each(client) {
    client.send(msg);
  });
};
