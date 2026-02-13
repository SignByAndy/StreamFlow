import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanningService, Planning } from '../../services/planning.service';

/**
 * Composant de liste des plannings
 */
@Component({
  selector: 'app-planning-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="plannings-container">
      <div class="header">
        <h2>Mes plannings</h2>
        <button class="btn-add" (click)="goToCreate()">+ Nouveau planning</button>
      </div>

      <div *ngIf="isLoading" class="loading">Chargement...</div>

      <div *ngIf="!isLoading && plannings.length === 0" class="empty">
        <p>Aucun planning pour le moment.</p>
        <button class="btn-primary" (click)="goToCreate()">Créer votre premier planning</button>
      </div>

      <div *ngIf="!isLoading && plannings.length > 0" class="plannings-grid">
        <div *ngFor="let planning of plannings" class="planning-card">
          <h3>{{ planning.title }}</h3>
          <p class="description">{{ planning.description || 'Pas de description' }}</p>
          <p class="date">Créé le {{ planning.created_at | date: 'dd/MM/yyyy' }}</p>
          <div class="actions">
            <button class="btn-edit" (click)="goToEdit(planning.id)">Modifier</button>
            <button class="btn-duplicate" (click)="duplicate(planning.id)">Dupliquer</button>
            <button class="btn-delete" (click)="delete(planning.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .plannings-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 20px;
    }

    h2 {
      color: #333;
      margin: 0;
    }

    .btn-add {
      padding: 10px 20px;
      background-color: #6366f1;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-add:hover {
      background-color: #4f46e5;
    }

    .loading, .empty {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .plannings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .planning-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }

    .planning-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .planning-card h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .description {
      color: #666;
      font-size: 14px;
      margin: 10px 0;
    }

    .date {
      color: #999;
      font-size: 12px;
      margin: 10px 0 20px 0;
    }

    .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .actions button {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
    }

    .btn-edit {
      background-color: #6366f1;
      color: white;
    }

    .btn-edit:hover {
      background-color: #4f46e5;
    }

    .btn-duplicate {
      background-color: #10b981;
      color: white;
    }

    .btn-duplicate:hover {
      background-color: #059669;
    }

    .btn-delete {
      background-color: #ef4444;
      color: white;
    }

    .btn-delete:hover {
      background-color: #dc2626;
    }

    .btn-primary {
      padding: 12px 24px;
      background-color: #6366f1;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-primary:hover {
      background-color: #4f46e5;
    }
  `]
})
export class PlanningListComponent implements OnInit {
  private planningService = inject(PlanningService);
  private router = inject(Router);

  plannings: Planning[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadPlannings();
  }

  loadPlannings() {
    this.isLoading = true;
    this.planningService.getPlannings().subscribe({
      next: (response) => {
        this.plannings = response.plannings;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.isLoading = false;
      }
    });
  }

  goToCreate() {
    this.router.navigate(['/plannings/create']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/plannings/edit', id]);
  }

  duplicate(id: number) {
    this.planningService.duplicatePlanning(id).subscribe({
      next: () => {
        this.loadPlannings();
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }

  delete(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce planning?')) {
      this.planningService.deletePlanning(id).subscribe({
        next: () => {
          this.loadPlannings();
        },
        error: (error) => {
          console.error('Erreur:', error);
        }
      });
    }
  }
}
