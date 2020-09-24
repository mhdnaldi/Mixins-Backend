const route = require("express").Router();
const { postMessage, getRoomId, addFriends } = require("../controller/c_chat");

route.post("/", postMessage);
route.post("/add-friends", addFriends);
route.get("/room-id/:id", getRoomId);

module.exports = route;
