const route = require("express").Router();
const {
  addFriends,
  getMyFriends,
  createRoom,
  sendMessage,
  getRoomId,
  searchFriend,
} = require("../controller/c_chat");

route.post("/add-friends", addFriends);
route.get("/get-friends/:id", getMyFriends);
route.get("/search-friends/:id", searchFriend);
route.post("/create-room", createRoom);
route.post("/send-message", sendMessage);
route.get("/room-id/:id", getRoomId);

module.exports = route;
