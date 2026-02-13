require('dotenv').config();
const { Pool } = require('pg');

/**
 * Configuration de la connexion PostgreSQL
 * Utilise Pool pour gérer plusieurs connexions simultanées
 */
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

/**
 * Initialise les tables de la base de données
 * Les tables ne sont créées que si elles n'existent pas
 */
async function initDatabase() {
  try {
    // Table users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(512) NOT NULL,
        twitch_channel VARCHAR(255),
        logo_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS plannings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        week_start_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables initialisées');
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation:', err);
  }
}

module.exports = { pool, initDatabase };