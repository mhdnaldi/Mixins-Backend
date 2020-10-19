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
  forgotPassword,
  changePassword,
  updatePosition,
  patchBio,
} = require("../controller/c_auth");

// GET ALL USER
route.get("/", authorization, getAllUser);
route.get("/:id", authorization, getUserById);
route.post("/forgot-password", forgotPassword);
route.patch("/change-password", changePassword);
route.patch("/update-position/:id", updatePosition); // here
route.patch("/:id", authorization, uploads, patchUser);
route.patch("/bio/:id", patchBio);
route.delete("/:id", authorization, uploads, deleteUser);
// AUTH
route.post("/register", registerUser);
route.post("/login", loginUser);

module.exports = route;
