// src/app/services/auth.service.ts

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators'; 
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://arequipa-hoy-backend.onrender.com/api';
  private isBrowser: boolean;

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.currentUserSubject = new BehaviorSubject<any>(this.getUserFromToken());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private getUserFromToken(): any | null {
    if (this.isBrowser) {
      const token = this.getToken();
      if (token) {
        try {
          return jwtDecode(token); 
        } catch (e) {
          console.error('Token inválido:', e);
          this.clearLocalStorage();
          return null;
        }
      }
    }
    return null;
  }
  
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/`, userData).pipe(
      tap(response => {
        // 'tap' nos permite "espiar" la respuesta sin alterarla.
        // Aquí es donde guardamos los tokens y actualizamos el estado.
        if (response && response.access && response.refresh) {
          if (this.isBrowser) {
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);
            
            // Notificamos a toda la app que un nuevo usuario ha iniciado sesión.
            this.currentUserSubject.next(this.getUserFromToken());
          }
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      this.clearLocalStorage();
    }
    // Notificamos a la app que ya no hay usuario.
    this.currentUserSubject.next(null);
    // Redirigimos al login.
    this.router.navigate(['/login']);
  }

  // Método de ayuda para no repetir código.
  private clearLocalStorage(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('access_token');
    }
    return null;
  }
  
  isLoggedIn(): boolean {
    // Si hay un valor en currentUserValue (no es null), el usuario está logueado.
    return !!this.currentUserValue;
  }
  
  isOrganizer(): boolean {
    return this.isLoggedIn() && this.currentUserValue?.rol === 'organizer';
  }
}