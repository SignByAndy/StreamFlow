require('dotenv').config();  // pour lire le fichier .env
const { Client } = require('pg'); // driver PostgreSQL

// configuration de la connexion
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function main() {
  try {
    await client.connect(); // se connecter à PostgreSQL
    console.log('Connecté à PostgreSQL ✅');

    // créer une table si elle n'existe pas
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT
      )
    `);

    // ajouter un utilisateur
    await client.query(
      `INSERT INTO users (name, email) VALUES ($1, $2)`,
      ['Ali', 'ali@mail.com']
    );

    // vide la table users
    await client.query(
        `TRUNCATE TABLE users`,
    );

    // lire tous les utilisateurs
    const res = await client.query(`SELECT * FROM users`);
    console.log(res.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end(); // fermer la connexion
  }
}

main();
