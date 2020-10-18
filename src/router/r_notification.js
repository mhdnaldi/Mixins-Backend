const route = require("express").Router();

const { getChatNotification } = require("../controller/c_notification");

route.get("/");
route.get("/chat-notification/:id", getChatNotification);

module.exports = route;
