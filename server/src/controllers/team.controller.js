const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllMembers = async (req, res) => {
    try {
        const members = await prisma.teamMember.findMany({
            orderBy: { rank: 'asc' }
        });
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'équipe' });
    }
};

exports.createMember = async (req, res) => {
    try {
        const { name, role, youtube, linkedin, bio, rank, mandateYear, competences, experience, formation, projets } = req.body;
        // Image logic handled by middleware or client sending URL
        const image = req.body.image || null;

        const newMember = await prisma.teamMember.create({
            data: {
                name,
                role,
                image,
                linkedin,
                bio,
                rank: parseInt(rank) || 0,
                mandateYear: mandateYear || "2025",
                competences: competences || [],
                experience,
                formation,
                projets: projets || []
            }
        });
        res.status(201).json(newMember);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du membre' });
    }
};

exports.updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, image, linkedin, bio, rank, mandateYear, competences, experience, formation, projets } = req.body;

        const updatedMember = await prisma.teamMember.update({
            where: { id },
            data: {
                name,
                role,
                image,
                linkedin,
                bio,
                rank: parseInt(rank),
                mandateYear,
                competences,
                experience,
                formation,
                projets
            }
        });
        res.json(updatedMember);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
};

exports.deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.teamMember.delete({ where: { id } });
        res.json({ message: 'Membre supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};
