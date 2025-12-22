const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const articleRoutes = require('./routes/article.routes');
const uploadRoutes = require('./routes/upload.routes');
const statsRoutes = require('./routes/stats.routes');
const teamRoutes = require('./routes/team.routes');
const { trackVisit } = require('./middleware/trackVisit');

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
    setHeaders: (res, path, stat) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        res.set('Access-Control-Allow-Origin', '*');
    }
}));

// Middleware (Global)
app.use(trackVisit);

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/team', teamRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API JMC Aix-Marseille 🚀' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message, stack: err.stack });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Force Keep-Alive (Debug for Windows Environment)
setInterval(() => { }, 10000);
