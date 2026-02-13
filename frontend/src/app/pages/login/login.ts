import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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
  private authService = inject(AuthService);
  private cryptoService = inject(CryptoService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  async onLogin(form: NgForm) {
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

    this.isLoading = true;

    try {
      const response = await this.authService.login(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      // Extraire le message d'erreur du serveur
      if (error?.error?.error) {
        this.errorMessage = error.error.error;
      } else if (typeof error?.error === 'string') {
        this.errorMessage = error.error;
      } else if (error?.message) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
      
      this.password = '';
      form.controls['password']?.reset();
      // Reset isLoading immédiatement
      this.isLoading = false;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
