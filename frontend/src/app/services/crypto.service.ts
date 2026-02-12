import { Injectable } from '@angular/core';

/**
 * Service de cryptographie
 * Hache les mots de passe côté client avant envoi au serveur
 */
@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  /**
   * Hache un mot de passe avec SHA-256
   * @param password - Mot de passe en clair
   * @returns Promise du hash en hexadécimal
   */
  async hashPassword(password: string): Promise<string> {
    // Encoder le mot de passe en bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Utiliser l'API Web Crypto pour SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convertir le buffer en hexadécimal
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }
}
