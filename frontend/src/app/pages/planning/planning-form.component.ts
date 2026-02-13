import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanningService } from '../../services/planning.service';

/**
 * Composant pour créer/éditer un planning
 */
@Component({
  selector: 'app-planning-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="form-container">
      <h2>{{ isEdit ? 'Modifier le planning' : 'Créer un planning' }}</h2>

      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Titre</label>
          <input
            id="title"
            type="text"
            [(ngModel)]="title"
            name="title"
            placeholder="Mon planning"
            required
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            [(ngModel)]="description"
            name="description"
            placeholder="Description optionnelle"
            rows="4"
          ></textarea>
        </div>

        <div class="actions">
          <button type="submit" class="btn-save">{{ isEdit ? 'Modifier' : 'Créer' }}</button>
          <button type="button" class="btn-cancel" (click)="goBack()">Annuler</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 50px auto;
      padding: 30px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #333;
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
    }

    input, textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #6366f1;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-top: 30px;
    }

    button {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-save {
      background-color: #6366f1;
      color: white;
    }

    .btn-save:hover {
      background-color: #4f46e5;
    }

    .btn-cancel {
      background-color: #e5e7eb;
      color: #333;
    }

    .btn-cancel:hover {
      background-color: #d1d5db;
    }
  `]
})
export class PlanningFormComponent implements OnInit {
  private planningService = inject(PlanningService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  title = '';
  description = '';
  isEdit = false;
  planningId: number | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.planningId = parseInt(id);
      this.loadPlanning();
    }
  }

  loadPlanning() {
    if (!this.planningId) return;
    
    this.planningService.getPlanning(this.planningId).subscribe({
      next: (response) => {
        this.title = response.planning.title;
        this.description = response.planning.description || '';
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }

  onSubmit() {
    if (this.isEdit && this.planningId) {
      this.planningService.updatePlanning(this.planningId, this.title, this.description).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erreur:', error);
        }
      });
    } else {
      this.planningService.createPlanning(this.title, this.description).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erreur:', error);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
