import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  id: number;
  planning_id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  color?: string;
  created_at: string;
}

/**
 * Service de gestion des événements
 */
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les événements d'un planning
   */
  getEventsByPlanning(planningId: number): Observable<{ events: Event[] }> {
    return this.http.get<{ events: Event[] }>(`${this.apiUrl}/planning/${planningId}`);
  }

  /**
   * Récupère un événement spécifique
   */
  getEvent(id: number): Observable<{ event: Event }> {
    return this.http.get<{ event: Event }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouvel événement
   */
  createEvent(
    planningId: number,
    title: string,
    startTime: string,
    endTime: string,
    description?: string,
    color?: string
  ): Observable<{ event: Event }> {
    return this.http.post<{ event: Event }>(this.apiUrl, {
      planning_id: planningId,
      title,
      description,
      start_time: startTime,
      end_time: endTime,
      color
    });
  }

  /**
   * Met à jour un événement
   */
  updateEvent(
    id: number,
    title?: string,
    description?: string,
    startTime?: string,
    endTime?: string,
    color?: string
  ): Observable<{ event: Event }> {
    return this.http.put<{ event: Event }>(`${this.apiUrl}/${id}`, {
      title,
      description,
      start_time: startTime,
      end_time: endTime,
      color
    });
  }

  /**
   * Supprime un événement
   */
  deleteEvent(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
