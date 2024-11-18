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

const width = 64;
const height = 64;
const pixelsMatrix = Array(height)
  .fill()
  .map(() =>
    Array(width)
      .fill()
      .map(() => [null, "#ffffff"]),
  );

app.use(cors());

// TODO: validate that the user is correctly logged in
app.get("/messages", (req, res) => {
  res.send(messages);
});

// TODO: validate that the user is correctly logged in
app.get("/canvas", (req, res) => {
  res.send(pixelsMatrix);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("new_message", (token, message) => {
    console.log("token:" + token);
    // TODO: verify and get user identity and use it instead of pushing token
    // TODO: only retain a maximum number of messages
    messages.push([token, message]);
    io.emit("new_message", [token, message]);
  });

  socket.on(
    "new_pixel",
    (
      token,
      /** @param {{ x: number, y: number, color: string }} pixel */ pixel,
    ) => {
      console.log("pixel placement requestor token:" + token);
      // TODO: verify and get user identity and use it instead of putting token
      // TODO: verify that x and y are within bounds, and that color is correct
      pixelsMatrix[pixel.y][pixel.x] = [token, pixel.color];
      io.emit("new_pixel", [token, pixel]);
    },
  );
});

server.listen(3111, () => {
  console.log("server running at https://localhost:3111");
});
