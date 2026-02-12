const crypto = require('crypto');

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Hache un mot de passe avec un salt
 * @param {string} password - Mot de passe en clair
 * @returns {Promise<string>} - Hash au format salt:hash
 */
function hashPassword(password) {
  const salt = generateSalt();
  const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
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
  const testHash = crypto.createHash('sha256').update(password + salt).digest('hex');
  return Promise.resolve(originalHash === testHash);
}

module.exports = {
  hashPassword,
  verifyPassword
};
