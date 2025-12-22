const express = require('express');
const {
    createArticle,
    getArticles,
    getArticle,
    updateArticle,
    deleteArticle
} = require('../controllers/article.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getArticles);
router.get('/:id', getArticle);
router.post('/', protect, createArticle);
router.put('/:id', protect, updateArticle);
router.delete('/:id', protect, deleteArticle);

module.exports = router;
