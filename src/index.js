const route = require("express").Router();
const users = require("./router/r_auth");
const chat = require("./router/r_chat");
const notification = require("./router/r_notification");

route.use("/users", users);
route.use("/chat", chat);
route.use("/notification", notification);

module.exports = route;
