import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Planning {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Service de gestion des plannings
 */
@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private apiUrl = 'http://localhost:3000/api/plannings';

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les plannings de l'utilisateur
   */
  getPlannings(): Observable<{ plannings: Planning[] }> {
    return this.http.get<{ plannings: Planning[] }>(this.apiUrl);
  }

  /**
   * Récupère un planning spécifique avec ses événements
   */
  getPlanning(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouveau planning
   */
  createPlanning(title: string, description?: string): Observable<{ planning: Planning }> {
    return this.http.post<{ planning: Planning }>(this.apiUrl, {
      title,
      description
    });
  }

  /**
   * Met à jour un planning
   */
  updatePlanning(id: number, title?: string, description?: string): Observable<{ planning: Planning }> {
    return this.http.put<{ planning: Planning }>(`${this.apiUrl}/${id}`, {
      title,
      description
    });
  }

  /**
   * Supprime un planning
   */
  deletePlanning(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Duplique un planning avec tous ses événements
   */
  duplicatePlanning(id: number): Observable<{ planning: Planning }> {
    return this.http.post<{ planning: Planning }>(`${this.apiUrl}/${id}/duplicate`, {});
  }
}
