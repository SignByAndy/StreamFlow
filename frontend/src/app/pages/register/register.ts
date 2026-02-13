import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CryptoService } from '../../services/crypto.service';

/**
 * Composant d'inscription
 * Permet aux utilisateurs de créer un nouveau compte
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private cryptoService = inject(CryptoService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  async onRegister() {
    this.errorMessage = '';

    // Validation
    if (!this.name || !this.name.trim()) {
      this.errorMessage = 'Le nom est requis';
      return;
    }

    if (!this.email || !this.email.trim()) {
      this.errorMessage = 'L\'email est requis';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Format d\'email invalide';
      return;
    }

    if (!this.password || !this.password.trim()) {
      this.errorMessage = 'Le mot de passe est requis';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.isLoading = true;

    try {
      const response = await this.authService.register(this.name, this.email, this.password);
      console.log('Inscription réussie:', response);
      // Rediriger vers dashboard
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error?.error?.error || 'Erreur lors de l\'inscription';
    } finally {
      this.isLoading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
