const route = require("express").Router();
const {
  addFriends,
  getMyFriends,
  createRoom,
  sendMessage,
  getRoomId,
} = require("../controller/c_chat");

route.post("/add-friends", addFriends);
route.get("/get-friends/:id", getMyFriends);
route.post("/create-room", createRoom);
route.post("/send-message", sendMessage);
route.get("/room-id/:id", getRoomId);

module.exports = route;
