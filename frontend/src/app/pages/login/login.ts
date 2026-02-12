import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Composant de connexion
 * Gère l'authentification des utilisateurs
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  onLogin() {
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
      this.errorMessage = 'Mots de passe ou identifiants invalides';
      return;
    }

    this.isLoading = true;

    // TODO: Remplacer par un appel HTTP au backend (authService.login)
    console.log('Tentative de connexion avec:', {
      email: this.email,
      password: '***'
    });

    // Simulation - à remplacer par un vrai appel API
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
