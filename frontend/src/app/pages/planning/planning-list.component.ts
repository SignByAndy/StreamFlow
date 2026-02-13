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
  templateUrl: './planning-list.component.html',
  styleUrl: './planning-list.component.css'
})
export class PlanningListComponent implements OnInit {
  private planningService = inject(PlanningService);
  private router = inject(Router);

  plannings: Planning[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit() {
    this.loadPlannings();
  }

  loadPlannings() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.planningService.getPlannings().subscribe({
      next: (response) => {
        this.plannings = response.plannings;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = `Erreur: ${error?.error?.error || error?.message || 'Erreur inconnue'}`;
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
