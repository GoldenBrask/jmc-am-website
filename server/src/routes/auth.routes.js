const express = require('express');
const { login, register } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', login);
router.post('/register', register); // Ideally this should be protected or removed in prod after initial setup

module.exports = router;
