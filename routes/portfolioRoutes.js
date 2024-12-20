const express = require("express");
const router = express.Router();
const authenticateToken = require("../auth");
const {
  addPortfolio,
  getPortfolio,
  getInvestmentRecommendation,
} = require("../controllers/portfolioController");

// Add a new portfolio entry
router.post("/", authenticateToken, addPortfolio);

// Fetch portfolio by userId
router.get("/:userId", authenticateToken, getPortfolio);

// Get investment recommendations based on portfolio
router.get(
  "/recommendations/:userId",
  authenticateToken,
  getInvestmentRecommendation
);

module.exports = router;
