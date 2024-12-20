// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  loginUser,
  setRiskLevel,
  getUserById, // New controller function
} = require("../controllers/userController");

// Mendapatkan semua pengguna
router.get("/", getUsers);

// Mendapatkan pengguna berdasarkan userId
router.get("/:userId", getUserById); // New route

// Menambah pengguna baru
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/risklevel", setRiskLevel);

module.exports = router;
