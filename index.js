const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const routerNavigation = require("./src");
// SOCKET.IO
const socket = require("socket.io");

const app = express();
app.use(cors());
app.use(express.static("uploads"));

// SOCKET IO ----------------------------------------------------
const http = require("http");
const server = http.createServer(app);
const io = socket(server);

io.on("connection", (socket) => {
  console.log("socket.io connected");
  // Global Message
  // socket.on("globalMessage", (data) => {
  //   io.emit("chatMessage", data);
  // });

  // Private Message
  // socket.on("privateMessage", (data) => {
  //   socket.emit("chatMessage", data);
  // });

  // Broadcast Message
  // socket.on("broadcastMessage", (data) => {
  //   socket.broadcast.emit("chatMessage", data);
  // });

  // Welcome Message ----------------------------
  socket.on("welcomeMessage", (data) => {
    socket.emit("chatMessage", {
      username: "BOT",
      message: `Welcome, ${data.username}`,
    });

    // Join room
    socket.join(data.room);
    // Spesifik
    socket.broadcast.to(data.room).emit("chatMessage", {
      username: "BOT",
      message: `${data.username} is Join us`,
    });
  });
  // ---------------------------------------------

  // is Typing
  socket.on("typing", (data) => {
    socket.broadcast.emit("typingMessage", data);
  });

  socket.on("roomMessage", (data) => {
    io.to(data.room).emit("chatMessage", data);
  });

  socket.on("setRoom", (data) => {
    socket.join(data);
  });
  socket.on("mixinsMsg", (data) => {
    io.to(data.room_id).emit("chatMixins", data);
  });
});
//  -------------------------------------------------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use("/", routerNavigation);

server.listen(3000, () => {
  console.log("Listening on Port 3000");
});
