import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PlanningService, Planning, StreamItem } from '../../services/planning.service';

/**
 * Composant PLANNING LIST
 * Affiche:
 * - Une sidebar avec la liste des plannings de l'utilisateur
 * - Une grille 7 jours (lun->dim) affichant les streams de chaque jour
 * - Un formulaire modal pour ajouter des streams
 */
@Component({
  selector: 'app-planning-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './planning-list.component.html',
  styleUrl: './planning-list.component.css'
})
export class PlanningListComponent implements OnInit, OnDestroy {
  private planningService = inject(PlanningService);

  plannings: Planning[] = [];
  activePlanning: Planning | null = null;
  streams: StreamItem[] = [];

  processing = false;
  errorMessage = '';

  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  activeWeekRange = '';

  isStreamFormOpen = false;
  streamDayIndex = 0;
  streamTitle = '';
  streamGame = '';
  streamStartTime = '';
  streamEndTime = '';

  private updateSubscription: any;

  ngOnInit() {
    this.chargerPlannings();
    
    this.updateSubscription = this.planningService.planningsUpdated$.subscribe(() => {
      this.chargerPlannings();
    });
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  chargerPlannings() {
    this.processing = true;
    this.errorMessage = '';

    this.planningService.getPlannings().subscribe({
      next: (response) => {
        this.plannings = response.plannings || [];
        if (this.plannings.length > 0) {
          this.selectionnnerPlanning(this.plannings[0]);
        } else {
          this.activePlanning = null;
          this.streams = [];
        }
        this.processing = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.error || 'Erreur lors du chargement des plannings';
        this.processing = false;
      }
    });
  }

  selectionnnerPlanning(planning: Planning) {
    this.activePlanning = planning;
    this.activeWeekRange = this.calculerPlage(planning.week_start_date);
    this.chargerStreams(planning.id);
  }

  chargerStreams(planningId: number) {
    this.planningService.getStreams(planningId).subscribe({
      next: (response) => {
        this.streams = response.streams || [];
      },
      error: (error) => {
        this.errorMessage = error?.error?.error || 'Erreur lors du chargement des streams';
      }
    });
  }

  ouvrirFormulaireStream(dayIndex: number) {
    this.streamDayIndex = dayIndex;
    this.streamTitle = '';
    this.streamGame = '';
    this.streamStartTime = '';
    this.streamEndTime = '';
    this.isStreamFormOpen = true;
  }

  fermerFormulaire() {
    this.isStreamFormOpen = false;
  }

  creerStream() {
    if (!this.activePlanning) {
      this.errorMessage = 'Aucun planning sélectionné';
      return;
    }
    if (!this.streamTitle.trim()) {
      this.errorMessage = 'Le titre est requis';
      return;
    }
    if (!this.streamStartTime) {
      this.errorMessage = 'L\'heure de début est requise';
      return;
    }
    if (!this.streamEndTime) {
      this.errorMessage = 'L\'heure de fin est requise';
      return;
    }

    this.planningService.createStream(this.activePlanning.id, {
      title: this.streamTitle.trim(),
      game: this.streamGame.trim() || null,
      day_index: this.streamDayIndex,
      start_time: this.streamStartTime,
      end_time: this.streamEndTime
    }).subscribe({
      next: () => {
        this.chargerStreams(this.activePlanning!.id);
        this.fermerFormulaire();
      },
      error: (error) => {
        this.errorMessage = error?.error?.error || 'Erreur lors de la création du stream';
      }
    });
  }

  supprimerPlanning(planning: Planning) {
    if (confirm(`Supprimer "${planning.title}" ?`)) {
      this.planningService.deletePlanning(planning.id).subscribe({
        next: () => {
          this.chargerPlannings();
        },
        error: (error) => {
          this.errorMessage = error?.error?.error || 'Erreur lors de la suppression';
        }
      });
    }
  }

  obtenirStreamsJour(dayIndex: number): StreamItem[] {
    return this.streams.filter(stream => stream.day_index === dayIndex);
  }

  formaterHeure(heure: string): string {
    if (!heure) return '';
    return heure.slice(0, 5);
  }

  calculerPlage(dateDebut: string): string {
    const debut = this.convertirDate(dateDebut);
    const fin = new Date(debut);
    fin.setDate(fin.getDate() + 6); // 7 jours = 6 jours après le début

    const debutLabel = this.formaterDate(debut);
    const finLabel = `${fin.getDate()} ${this.moisLabel(fin.getMonth())}`;
    
    return `${debutLabel} -> ${finLabel}`;
  }

  private formaterDate(date: Date): string {
    return `${date.getDate()} ${this.moisLabel(date.getMonth())}`;
  }

  private convertirDate(dateStr: string): Date {
    const [annee, mois, jour] = dateStr.split('-').map(Number);
    return new Date(annee, mois - 1, jour);
  }

  private moisLabel(indexMois: number): string {
    const mois = [
      'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
    ];
    return mois[indexMois] || '';
  }
}
