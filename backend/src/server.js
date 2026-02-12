require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db');

// Import des routes
const authRoutes = require('./route/auth');
const planningRoutes = require('./route/planning');
const eventRoutes = require('./route/event');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route de base
app.get('/', (req, res) => {
  res.json({ 
    message: 'API StreamFlow 🚀',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      plannings: '/api/plannings',
      events: '/api/events'
    }
  });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/plannings', planningRoutes);
app.use('/api/events', eventRoutes);

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Initialisation de la base de données et démarrage du serveur
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
  }
}

startServer();
