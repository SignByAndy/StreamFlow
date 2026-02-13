import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningService, Planning } from '../../services/planning.service';

@Component({
  selector: 'app-planning-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planning-list.component.html',
  styleUrl: './planning-list.component.css'
})
export class PlanningListComponent implements OnInit {
  private planningService = inject(PlanningService);

  plannings: Planning[] = [];
  activePlanning: Planning | null = null;
  isLoading = true;
  errorMessage = '';
  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  activeWeekRange = '';

  ngOnInit() {
    this.loadPlannings();
  }

  loadPlannings() {
    this.isLoading = true;
    this.errorMessage = '';

    this.planningService.getPlannings().subscribe({
      next: (response) => {
        this.plannings = response.plannings;
        this.activePlanning = this.plannings[0] || null;
        this.activeWeekRange = this.activePlanning
          ? this.formatWeekRange(this.activePlanning.week_start_date)
          : '';
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.error || 'Erreur lors du chargement.';
        this.isLoading = false;
      }
    });
  }

  selectPlanning(planning: Planning) {
    this.activePlanning = planning;
    this.activeWeekRange = this.formatWeekRange(planning.week_start_date);
  }

  createPlanning() {
    const weekStart = this.getWeekStartDate(new Date());
    const weekStartStr = this.toDateInputValue(weekStart);
    const title = `Planning semaine du ${this.formatDateLabel(weekStart)}`;

    this.planningService.createPlanning(title, weekStartStr).subscribe({
      next: (response) => {
        this.loadPlannings();
      },
      error: (error) => {
        this.errorMessage = error?.error?.error || 'Erreur lors de la création.';
      }
    });
  }

  deletePlanning(planning: Planning) {
    this.planningService.deletePlanning(planning.id).subscribe({
      next: () => {
        this.loadPlannings();
      },
      error: (error) => {
        this.errorMessage = error?.error?.error || 'Erreur lors de la suppression.';
      }
    });
  }

  private getWeekStartDate(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    const diff = (day + 6) % 7;
    result.setDate(result.getDate() - diff);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  formatWeekRange(weekStart: string): string {
    const startDate = this.parseDate(weekStart);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const startLabel = this.formatDateLabel(startDate);
    const endLabel = `${endDate.getDate()} ${this.monthName(endDate.getMonth())}`;
    return `${startLabel} -> ${endLabel}`;
  }

  private formatDateLabel(date: Date): string {
    return `${date.getDate()} ${this.monthName(date.getMonth())}`;
  }

  private toDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseDate(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, (month || 1) - 1, day || 1);
  }

  private monthName(index: number): string {
    const months = [
      'Janvier',
      'Fevrier',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Aout',
      'Septembre',
      'Octobre',
      'Novembre',
      'Decembre'
    ];
    return months[index] || '';
  }
}
