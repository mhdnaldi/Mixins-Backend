const route = require("express").Router();
const {
  addFriends,
  getMyFriends,
  createRoom,
  sendMessage,
  getRoomId,
  searchFriend,
  getUserRoom,
  getAllUserRoom,
  deleteFriend,
} = require("../controller/c_chat");

route.post("/add-friends", addFriends);
route.get("/get-friends/:id", getMyFriends);
route.get("/get-room/:id", getAllUserRoom);
route.get("/room-id/:id", getRoomId);
route.get("/user-room", getUserRoom);
route.get("/search-friends", searchFriend);
route.post("/create-room", createRoom);
route.post("/send-message", sendMessage);
route.delete("/delete-friends/:id", deleteFriend); // here

module.exports = route;
