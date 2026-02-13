import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, timeout } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CryptoService } from './crypto.service';

export interface User {
  id: number;
  name: string;
  email: string;
  twitch_channel?: string;
  logo_url?: string;
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

/**
 * Service d'authentification
 * Gère la connexion, inscription et les appels API authentifiés
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cryptoService: CryptoService
  ) {}

  /**
   * Récupère l'utilisateur depuis le localStorage
   */
  private getUserFromStorage(): User | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const hashedPassword = await this.cryptoService.hashPassword(password);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      name,
      email,
      password: hashedPassword
    }).pipe(
      timeout(10000),
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        console.error('❌ Erreur register - status:', error.status, 'body:', error.error);
        return throwError(() => error);
      })
    ).toPromise() as Promise<AuthResponse>;
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const hashedPassword = await this.cryptoService.hashPassword(password);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email,
      password: hashedPassword
    }).pipe(
      timeout(10000),
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        console.error('❌ Erreur login - status:', error.status, 'body:', error.error);
        return throwError(() => error);
      })
    ).toPromise() as Promise<AuthResponse>;
  }

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  getProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/profile`);
  }

  /**
   * Met à jour le profil de l'utilisateur
   */
  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    return this.http.put<{ user: User }>(`${this.apiUrl}/profile`, data).toPromise() as Promise<{ user: User }>;
  }

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Récupère le token JWT stocké
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Récupère l'utilisateur actuel
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }
}
