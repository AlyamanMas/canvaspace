import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { syncVariableToDisk, reconstructVariable } from "./utils.js";
import { Filter } from "bad-words";
import cors from "cors";

const filter = new Filter();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://example.com",
  },
});

const messages = reconstructVariable("messages.json");
const stopSyncingMessages = syncVariableToDisk(messages, "messages.json", 5000);

//const width = 64;
//const height = 64;
//const pixelsMatrix = Array(height)
//  .fill()
//  .map(() =>
//    Array(width)
//      .fill()
//      .map(() => [null, "#ffffff"]),
//  );

const pixelsMatrix = reconstructVariable("canvas.json");
const stopSyncingCanvas = syncVariableToDisk(pixelsMatrix, "canvas.json", 5000);

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
    message = filter.clean(message);
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
