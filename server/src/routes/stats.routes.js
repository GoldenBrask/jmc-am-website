const express = require('express');
const { getDashboardStats } = require('../controllers/stats.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getDashboardStats);

module.exports = router;
