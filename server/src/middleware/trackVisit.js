const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

const trackVisit = async (req, res, next) => {
    try {
        // Basic bot filtering (very simple)
        const userAgent = req.headers['user-agent'] || '';
        if (userAgent.match(/bot|crawl|spider/i)) {
            return next();
        }

        // Exclude Admin actions (if Authorization header is present)
        if (req.headers['authorization']) {
            return next();
        }

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const ipHash = crypto.createHash('sha256').update(ip + (process.env.JWT_SECRET || 'salt')).digest('hex');

        // Log visit
        await prisma.visit.create({
            data: {
                path: req.originalUrl,
                ipHash: ipHash,
                userAgent: userAgent
            }
        });

        // If viewing a specific article, increment views
        const articleMatch = req.originalUrl.match(/\/api\/articles\/([a-f0-9-]+)/); // Match UUID
        if (articleMatch && req.method === 'GET') {
            const articleId = articleMatch[1];
            // prevent self-counting if admin? (optional, skip for now to keep simple)
            await prisma.article.update({
                where: { id: articleId },
                data: { views: { increment: 1 } }
            }).catch(() => { }); // Ignore if article not found
        }

    } catch (err) {
        console.error('Tracking Error:', err);
    } finally {
        next();
    }
};

module.exports = { trackVisit };
