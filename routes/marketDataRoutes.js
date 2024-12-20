const express = require("express");
const router = express.Router();
const {
  getMarketData,
  addMarketData,
  getMarketDataBySector,
  getMarketDataSummary,
} = require("../controllers/marketDataController");

// Get all market data
router.get("/", getMarketData);

// Add new market data
router.post("/", addMarketData);

// Get market data by sector
router.get("/sector/:sector", getMarketDataBySector);

// Get market data summary (average return rate)
router.get("/summary", getMarketDataSummary);

module.exports = router;
