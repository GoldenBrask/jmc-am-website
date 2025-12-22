const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', teamController.getAllMembers);

// Protected routes (Admin only)
router.post('/', protect, teamController.createMember);
router.put('/:id', protect, teamController.updateMember);
router.delete('/:id', protect, teamController.deleteMember);

module.exports = router;
