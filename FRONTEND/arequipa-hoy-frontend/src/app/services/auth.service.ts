// src/app/services/auth.service.ts

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs'; // Importamos 'of' para el logout
import { tap } from 'rxjs/operators'; // El 'tap' va en 'rxjs/operators'
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Necesitarás instalar esta librería

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://arequipa-hoy-backend.onrender.com/api';
  private isBrowser: boolean;

  // Tu BehaviorSubject está perfecto para notificar cambios en la autenticación.
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Es crucial verificar si estamos en el navegador antes de tocar localStorage.
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Inicializamos el BehaviorSubject con los datos del token si existen.
    this.currentUserSubject = new BehaviorSubject<any>(this.getUserFromToken());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Este método está perfecto.
  private getUserFromToken(): any | null {
    if (this.isBrowser) {
      const token = this.getToken();
      if (token) {
        try {
          return jwtDecode(token); // Decodifica el token para obtener el payload (username, rol, etc.)
        } catch (e) {
          console.error('Token inválido:', e);
          this.clearLocalStorage();
          return null;
        }
      }
    }
    return null;
  }
  
  // Este método también está perfecto.
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // La función de registro está bien.
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  // --- ¡AQUÍ ESTÁ EL CAMBIO MÁS IMPORTANTE! ---
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

  // --- LOGOUT MEJORADO ---
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
  
  // isLoggedIn ahora es más simple y robusto.
  isLoggedIn(): boolean {
    // Si hay un valor en currentUserValue (no es null), el usuario está logueado.
    return !!this.currentUserValue;
  }
  
  // ¡Este método está perfecto para proteger rutas o mostrar/ocultar botones!
  isOrganizer(): boolean {
    return this.isLoggedIn() && this.currentUserValue?.rol === 'organizer';
  }
}