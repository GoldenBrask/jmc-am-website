const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create new article
const createArticle = async (req, res) => {
    try {
        const { title, content, category, excerpt, image, published } = req.body;
        // Assuming user is attached to req via middleware (we'll add that middleware next)
        // For now, hardcode or grab from token if middleware exists. 
        // We will assume a 'protect' middleware adds req.user

        // Fallback if no auth middleware yet (for testing):
        const authorId = req.user ? req.user.userId : (await prisma.user.findFirst()).id;

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const article = await prisma.article.create({
            data: {
                title,
                content,
                category,
                excerpt,
                image,
                published: published || false,
                slug: `${slug}-${Date.now()}`, // Ensure uniqueness
                authorId: authorId
            }
        });

        res.status(201).json(article);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating article' });
    }
};

// Get all articles
const getArticles = async (req, res) => {
    try {
        const articles = await prisma.article.findMany({
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { name: true, email: true } } }
        });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching articles' });
    }
};

// Get single article by ID
const getArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await prisma.article.findUnique({
            where: { id },
            include: { author: { select: { name: true } } }
        });
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching article' });
    }
};

// Update article
const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, excerpt, image, published } = req.body;

        const article = await prisma.article.update({
            where: { id },
            data: { title, content, category, excerpt, image, published }
        });

        res.json(article);
    } catch (error) {
        res.status(500).json({ message: 'Error updating article' });
    }
};

// Delete article
const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.article.delete({ where: { id } });
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting article' });
    }
};

module.exports = {
    createArticle,
    getArticles,
    getArticle,
    updateArticle,
    deleteArticle
};
