import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CryptoService } from '../../services/crypto.service';

/**
 * Composant de connexion
 * Gère l'authentification des utilisateurs avec double hachage
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private cryptoService = inject(CryptoService);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  async onLogin() {
    this.errorMessage = '';

    // Validation
    if (!this.email || !this.email.trim()) {
      this.errorMessage = 'L\'email est requis';
      return;
    }

    if (!this.password || !this.password.trim()) {
      this.errorMessage = 'Le mot de passe est requis';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Format d\'email invalide';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.isLoading = true;

    try {
      // Hachage côté client AVANT l'envoi
      const hashedPassword = await this.cryptoService.hashPassword(this.password);

      // TODO: Remplacer par un appel HTTP au backend (authService.login)
      console.log('Tentative de connexion avec:', {
        email: this.email,
        password: hashedPassword.substring(0, 20) + '...' // Affiche le hash (tronqué)
      });

      // Simulation - à remplacer par un vrai appel API
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    } catch (error) {
      this.errorMessage = 'Erreur lors du hachage du mot de passe';
      this.isLoading = false;
    }
  }
}
