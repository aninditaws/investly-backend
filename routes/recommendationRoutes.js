// routes/recommendationRoutes.js
const express = require('express');
const router = express.Router();
const { getInvestmentRecommendation } = require('../controllers/recommendationController');

router.get('/:userId', getInvestmentRecommendation);  // Rekomendasi berdasarkan userId

module.exports = router;
