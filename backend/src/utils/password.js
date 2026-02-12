/**
 * Utilitaire de gestion des mots de passe
 * Implémentation simple sans crypto
 */

/**
 * Génère un hash simple basé sur une chaîne
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Génère un salt aléatoire
 */
function generateSalt() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Hache un mot de passe avec un salt
 * @param {string} password - Mot de passe en clair
 * @returns {Promise<string>} - Hash au format salt:hash
 */
function hashPassword(password) {
  const salt = generateSalt();
  const hash = simpleHash(password + salt);
  return Promise.resolve(salt + ':' + hash);
}

/**
 * Vérifie si un mot de passe correspond au hash
 * @param {string} password - Mot de passe en clair
 * @param {string} hash - Hash stocké (format salt:hash)
 * @returns {Promise<boolean>} - true si le mot de passe correspond
 */
function verifyPassword(password, hash) {
  const [salt, originalHash] = hash.split(':');
  const testHash = simpleHash(password + salt);
  return Promise.resolve(originalHash === testHash);
}

module.exports = {
  hashPassword,
  verifyPassword
};
