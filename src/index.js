const route = require("express").Router();
const users = require("./router/r_auth");
const chat = require("./router/r_chat");

route.use("/users", users);
route.use("/chat", chat);

module.exports = route;
