import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Planning {
  id: number;
  user_id: number;
  title: string;
  week_start_date: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private apiUrl = 'http://localhost:3000/api/plannings';

  constructor(private http: HttpClient) {}

  getPlannings(): Observable<{ plannings: Planning[] }> {
    return this.http.get<{ plannings: Planning[] }>(this.apiUrl);
  }

  createPlanning(title: string, weekStartDate: string): Observable<{ planning: Planning }> {
    return this.http.post<{ planning: Planning }>(this.apiUrl, {
      title,
      week_start_date: weekStartDate
    });
  }

  deletePlanning(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
