import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  processing = false;

  async onLogin(form: NgForm) {
    this.errorMessage = '';

    // Validation: Email
    if (!this.email || !this.email.trim()) {
      this.errorMessage = 'L\'email est requis';
      return;
    }

    // Validation: Mot de passe
    if (!this.password || !this.password.trim()) {
      this.errorMessage = 'Le mot de passe est requis';
      return;
    }

    // Validation: Format d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Format d\'email invalide';
      return;
    }

    this.processing = true;

    try {
      // Appel au service de connexion
      const response = await this.authService.login(this.email, this.password);
      // Succès: rediriger vers dashboard
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      // Erreur: afficher le message
      if (error?.error?.error) {
        this.errorMessage = error.error.error;
      } else if (typeof error?.error === 'string') {
        this.errorMessage = error.error;
      } else if (error?.message) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
      
      // Réinitialiser le champ password
      this.password = '';
      form.controls['password']?.reset();
      this.processing = false;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
