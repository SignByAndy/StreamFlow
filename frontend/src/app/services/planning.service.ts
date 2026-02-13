import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Planning {
  id: number;
  user_id: number;
  title: string;
  week_start_date: string;
  created_at: string;
}

export interface StreamItem {
  id: number;
  planning_id: number;
  day_index: number;
  title: string;
  game?: string | null;
  start_time: string;
  end_time: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private apiUrl = 'http://localhost:3000/api/plannings';
  private planningsUpdated = new Subject<void>();

  planningsUpdated$ = this.planningsUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getPlannings(): Observable<{ plannings: Planning[] }> {
    return this.http.get<{ plannings: Planning[] }>(this.apiUrl);
  }

  createPlanning(title: string, weekStartDate: string): Observable<{ planning: Planning }> {
    return this.http.post<{ planning: Planning }>(this.apiUrl, {
      title,
      week_start_date: weekStartDate
    }).pipe(
      tap(() => this.planningsUpdated.next())
    );
  }

  deletePlanning(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.planningsUpdated.next())
    );
  }

  getStreams(planningId: number): Observable<{ streams: StreamItem[] }> {
    return this.http.get<{ streams: StreamItem[] }>(`${this.apiUrl}/${planningId}/streams`);
  }

  createStream(
    planningId: number,
    stream: Pick<StreamItem, 'title' | 'game' | 'day_index' | 'start_time' | 'end_time'>
  ): Observable<{ stream: StreamItem }> {
    return this.http.post<{ stream: StreamItem }>(`${this.apiUrl}/${planningId}/streams`, stream);
  }

  deleteStream(streamId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/streams/${streamId}`);
  }
}
