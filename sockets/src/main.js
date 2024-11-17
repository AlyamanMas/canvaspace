import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://example.com",
  },
});

const messages = [
  ["alyamanmas", "helloworld"],
  ["alyamanmas", "im here"],
  ["vexedblaze", "this is a default message"],
];

app.use(cors());

app.get("/messages", (req, res) => {
  res.send(messages);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("new_message", (token, message) => {
    console.log("token:" + token);
    messages.push([token, message]);
    io.emit("new_message", [token, message]);
  });
});

server.listen(3111, () => {
  console.log("server running at https://localhost:3111");
});
