const router = require("express").Router();

const {
  createUser,
  forgotPassword,
  logInUser,
  currentUser,
  resetPassword,
} = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userModel");

router.post("/register", createUser);
router.post("/login", logInUser);
router.get("/get-current-user", authMiddleware, currentUser);
router.patch("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);

module.exports = router;
