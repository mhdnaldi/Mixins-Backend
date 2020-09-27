const route = require("express").Router();
const {
  addFriends,
  getMyFriends,
  createRoom,
  sendMessage,
  getRoomId,
  searchFriend,
  getUserRoom,
} = require("../controller/c_chat");

route.post("/add-friends", addFriends);
route.get("/get-friends/:id", getMyFriends);
route.get("/room-id/:id", getRoomId);
route.get("/user-room", getUserRoom);
route.get("/search-friends", searchFriend);
route.post("/create-room", createRoom);
route.post("/send-message", sendMessage);

module.exports = route;
