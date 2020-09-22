const route = require("express").Router();
const users = require("./router/r_auth");

route.use("/users", users);

module.exports = route;
