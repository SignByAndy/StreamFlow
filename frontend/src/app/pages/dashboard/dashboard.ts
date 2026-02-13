import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlanningListComponent } from '../planning/planning-list.component';
import { AuthService } from '../../services/auth.service';

/**
 * Composant dashboard
 * Page principale après connexion
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PlanningListComponent],
  template: `
    <div class="dashboard-container">
      <div class="navbar">
        <div class="navbar-content">
          <h1>StreamFlow</h1>
          <div class="user-menu">
            <span *ngIf="currentUser">{{ currentUser.name }}</span>
            <button (click)="logout()" class="btn-logout">Déconnexion</button>
          </div>
        </div>
      </div>

      <div class="main-content">
        <app-planning-list></app-planning-list>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f9fafb;
    }

    .navbar {
      background-color: #6366f1;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h1 {
      margin: 0;
      font-size: 24px;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .user-menu span {
      font-size: 14px;
    }

    .btn-logout {
      padding: 8px 16px;
      background-color: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-logout:hover {
      background-color: #dc2626;
    }

    .main-content {
      padding: 20px;
    }

  `]
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser = this.authService.getCurrentUser();

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

