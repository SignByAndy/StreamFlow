import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Intercepteur HTTP
 * Ajoute le token JWT à chaque requête sortante
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  /** Intercepte les requêtes HTTP pour ajouter le token d'authentification */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Récupérer le token stocké
    const token = this.authService.getToken();

    // Si un token existe, l'ajouter à l'en-tête Authorization
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Passer la requête au prochain gestionnaire
    return next.handle(req);
  }
}
