const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
console.log(`Loading environment from: ${envPath}`);

if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    require('dotenv').config();
    console.log("Checking default .env location");
}

const prisma = new PrismaClient();

async function main() {
    console.log("\n--- DEBUG DATABASE CONTENT ---");
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'Defined (Starts with ' + process.env.DATABASE_URL.substring(0, 10) + '...)' : 'UNDEFINED'}`);

    try {
        // 1. Check TeamMember Table
        const teamCount = await prisma.teamMember.count();
        console.log(`\n[TeamMember] Total count: ${teamCount}`);

        if (teamCount > 0) {
            const members = await prisma.teamMember.findMany({ select: { id: true, name: true, role: true } });
            console.log("--- Members found in DB ---");
            members.forEach(m => console.log(`> ${m.name} - ${m.role}`));
        } else {
            console.log("Creating EMPTY state... No members found.");
        }

        // 2. Check User Table (Admin)
        const userCount = await prisma.user.count();
        console.log(`\n[User] Total users: ${userCount}`);
        const users = await prisma.user.findMany({ select: { email: true, role: true } });
        users.forEach(u => console.log(`> ${u.email} (${u.role})`));

    } catch (e) {
        console.error("\n!!! DATABASE ERROR !!!");
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
