const express = require('express');
const { upload, uploadFile } = require('../controllers/upload.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Upload route (Protected)
router.post('/', protect, upload.single('image'), uploadFile);

module.exports = router;
