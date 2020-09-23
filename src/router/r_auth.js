const route = require("express").Router();
const uploads = require("../middlware/multer");
const { authorization } = require("../middlware/auth");

const {
  registerUser,
  getAllUser,
  getUserById,
  loginUser,
  patchUser,
  deleteUser,
} = require("../controller/c_auth");

// GET ALL USER
route.get("/", authorization, getAllUser);
route.get("/:id", authorization, getUserById);
route.patch("/:id", authorization, uploads, patchUser);
route.delete("/:id", authorization, uploads, deleteUser);
// AUTH
route.post("/register", registerUser);
route.post("/login", loginUser);

module.exports = route;
