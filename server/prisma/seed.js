const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    require('dotenv').config();
}

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Seeding database...');

        // 1. Seed Admin User
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const user = await prisma.user.upsert({
            where: { email: 'admin@jmc.fr' },
            update: {
                password: hashedPassword, // Force update password in case it's wrong
                role: 'ADMIN'
            },
            create: {
                email: 'admin@jmc.fr',
                password: hashedPassword,
                name: 'Admin JMC',
                role: 'ADMIN'
            },
        });
        console.log('Admin user seeded:', user.email);

        // 2. Seed Articles (Existing logic)
        const articlesCount = await prisma.article.count();
        if (articlesCount === 0) {
            console.log('No articles found, seeding initial articles...');
            await prisma.article.createMany({
                data: [
                    {
                        title: "Lancement du nouveau site JMC",
                        slug: "lancement-nouveau-site-jmc",
                        content: "<h2>Bienvenue sur notre nouveau site !</h2><p>Nous sommes fiers de vous présenter notre nouvelle vitrine numérique...</p>",
                        excerpt: "Découvrez la nouvelle identité numérique de la Junior MIAGE Concept Aix-Marseille.",
                        category: "Actualité",
                        published: true,
                        authorId: user.id,
                        image: "/images/hero-bg.jpg" // Placeholder
                    },
                    {
                        title: "Retour sur le Congrès National 2024",
                        slug: "retour-cnh-2024",
                        content: "<p>Une expérience incroyable pour toute l'équipe...</p>",
                        excerpt: "Nos membres étaient présents au plus grand rassemblement des Junior-Entreprises.",
                        category: "Événement",
                        published: true,
                        authorId: user.id
                    },
                    {
                        title: "Nos conseils pour réussir son stage",
                        slug: "conseils-reussir-stage",
                        content: "<p>Voici 10 astuces pour transformer votre stage en embauche...</p>",
                        excerpt: "Préparez votre insertion professionnelle avec nos meilleurs conseils.",
                        category: "Conseil",
                        published: true,
                        authorId: user.id
                    }
                ]
            });
            console.log('Initial articles seeded.');
        }

        // 3. Seed Team Members
        const contentPath = path.join(__dirname, '../../client/src/data/content.json');
        if (fs.existsSync(contentPath)) {
            const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
            console.log('Seeding team members from content.json...');

            // Clear existing
            await prisma.teamMember.deleteMany({});

            for (const [index, member] of content.equipe_membres.entries()) {
                await prisma.teamMember.create({
                    data: {
                        name: member.nom,
                        role: member.poste,
                        image: member.image,
                        linkedin: member.linkedin_url_theorique,
                        bio: member.bio,
                        rank: index + 1
                    }
                });
            }
            console.log('Team members seeded successfully!');
        } else {
            console.warn('content.json not found, skipping team seeding.');
        }

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
