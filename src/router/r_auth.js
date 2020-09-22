const route = require("express").Router();

const { registerUser, getAllUser } = require("../controller/c_auth");

// GET ALL USER
route.get("/", getAllUser);
// REGISTER
route.post("/register", registerUser);

module.exports = route;
