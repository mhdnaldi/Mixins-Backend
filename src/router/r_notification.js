const route = require("express").Router();

const {
  getChatNotification,
  onlineStatus,
} = require("../controller/c_notification");

route.get("/");
route.get("/chat-notification/:id", getChatNotification);
route.patch("/:id", onlineStatus);

module.exports = route;
