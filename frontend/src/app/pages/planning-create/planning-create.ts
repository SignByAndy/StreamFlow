import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanningService } from '../../services/planning.service';

@Component({
  selector: 'app-planning-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planning-create.html',
  styleUrl: './planning-create.css'
})
export class PlanningCreateComponent implements OnInit {
  private planningService = inject(PlanningService);
  private router = inject(Router);

  title = '';
  weekValue = '';
  processing = false;
  errorMessage = '';

  ngOnInit() {
    const now = new Date();
    const weekStart = this.getWeekStartDate(now);
    this.weekValue = this.getIsoWeekValue(now);
    this.title = `Planning semaine du ${this.formatDateLabel(weekStart)}`;
  }

  submit() {
    this.errorMessage = '';

    if (!this.title.trim() || !this.weekValue) {
      this.errorMessage = 'Titre et semaine requis.';
      return;
    }

    const weekStartDate = this.getWeekStartFromIso(this.weekValue);

    if (!weekStartDate) {
      this.errorMessage = 'Semaine invalide.';
      return;
    }

    this.processing = true;

    this.planningService.createPlanning(this.title.trim(), weekStartDate).subscribe({
      next: () => {
        this.processing = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error?.error?.error || 'Erreur lors de la creation.';
        this.processing = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  private getWeekStartDate(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    const diff = (day + 6) % 7;
    result.setDate(result.getDate() - diff);
    result.setHours(0, 0, 0, 0);
    return result;
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

  private getIsoWeekValue(date: Date): string {
    const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = temp.getUTCDay() || 7;
    temp.setUTCDate(temp.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((temp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `${temp.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }

  private getWeekStartFromIso(weekValue: string): string {
    const match = /^(\d{4})-W(\d{2})$/.exec(weekValue);
    if (!match) {
      return '';
    }
    const year = Number(match[1]);
    const week = Number(match[2]);
    const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
    const dayOfWeek = simple.getUTCDay();
    const diff = dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8;
    simple.setUTCDate(simple.getUTCDate() - diff);
    const yyyy = simple.getUTCFullYear();
    const mm = String(simple.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(simple.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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
