const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Rename file to avoid collisions: fieldname-timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Erreur: Images seulement (jpeg, jpg, png, webp, gif)!'));
    }
});

// Controller function
const uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier uploadé' });
        }
        // Return relative URL
        res.json({
            message: 'Fichier uploadé avec succès',
            url: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        console.error('Upload Error Details:', error);
        res.status(500).json({ message: 'Erreur lors de l\'upload', error: error.message });
    }
};

module.exports = { upload, uploadFile };
