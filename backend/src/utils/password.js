/**
 * Vérifie si un mot de passe hasché correspond au hash stocké
 * @param {string} passwordHash - Hash SHA-256 du password (depuis le client)
 * @param {string} storedHash - Hash stocké en BDD
 * @returns {Promise<boolean>} - true si les hashes correspondent
 */
function verifyPassword(passwordHash, storedHash) {
  return Promise.resolve(passwordHash === storedHash);
}

module.exports = {
  verifyPassword
};
