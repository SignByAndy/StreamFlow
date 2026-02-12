const { verifyToken } = require('../utils/jwt');

/**
 * Middleware d'authentification
 * Vérifie le token JWT dans le header Authorization
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return res.status(403).json({ error: 'Token invalide ou expiré' });
  }

  // Ajouter les infos utilisateur à la requête
  req.user = payload;
  next();
}

module.exports = { authenticateToken };
