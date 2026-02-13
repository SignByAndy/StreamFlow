import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CryptoService } from './crypto.service';

// Représente un utilisateur
export interface User {
  id: number;
  name: string;
  email: string;
  twitch_channel?: string;
  logo_url?: string;
  created_at?: string;
}

// Réponse de l'API d'authentification
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
    // Hacher le mot de passe côté client
    const hashedPassword = await this.cryptoService.hashPassword(password);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      name,
      email,
      password: hashedPassword
    }).pipe(
      tap(response => {
        // Sauvegarder le token et l'utilisateur
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    ).toPromise() as Promise<AuthResponse>;
  }

  /** Connecte un utilisateur */
  async login(email: string, password: string): Promise<AuthResponse> {
    // Hacher le mot de passe côté client
    const hashedPassword = await this.cryptoService.hashPassword(password);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email,
      password: hashedPassword
    }).pipe(
      tap(response => {
        // Sauvegarder le token et l'utilisateur
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    ).toPromise() as Promise<AuthResponse>;
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
