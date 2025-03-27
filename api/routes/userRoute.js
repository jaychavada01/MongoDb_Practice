const express = require("express");
const protect = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  logoutUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  groupUsersByDomain,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

router.get("/all", protect, getAllUser);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

// aggregation
router.get("/aggregate/domains", protect, groupUsersByDomain);

module.exports = router;
