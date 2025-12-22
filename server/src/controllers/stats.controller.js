const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
        const last7Days = new Date(new Date().setDate(today.getDate() - 7));

        // 1. Total Visits (All Time)
        const totalVisits = await prisma.visit.count();

        // 2. Visits This Month
        const monthlyVisits = await prisma.visit.count({
            where: { timestamp: { gte: lastMonth } }
        });

        // 3. Last 7 Days Graph Data
        // We group by day. Postgres date_trunc is best here, utilizing Prisma $queryRaw
        const chartData = await prisma.$queryRaw`
      SELECT TO_CHAR(timestamp, 'MM-DD') as date, COUNT(*)::int as visits 
      FROM "Visit" 
      WHERE timestamp >= ${last7Days} 
      GROUP BY TO_CHAR(timestamp, 'MM-DD') 
      ORDER BY date ASC
    `;

        // 4. Top Articles
        const topArticles = await prisma.article.findMany({
            take: 5,
            orderBy: { views: 'desc' },
            select: { id: true, title: true, views: true, category: true }
        });

        res.json({
            totalVisits,
            monthlyVisits,
            chartData,
            topArticles
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur stats' });
    }
};

module.exports = { getDashboardStats };
