const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_super_securise_changez_moi';

/**
 * Génère un token JWT
 * @param {object} payload - Données à encoder (userId, email, etc.)
 * @param {string} expiresIn - Durée de validité (ex: '24h', '7d')
 * @returns {string} - Token JWT
 */
function generateToken(payload, expiresIn = '24h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Vérifie et décode un token JWT
 * @param {string} token - Token JWT à vérifier
 * @returns {object|null} - Payload décodé ou null si invalide
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken
};
