// frontend/src/app/services/auth.service.ts (CORREGIDO)

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs'; // 'tap' no se usaba en tu versión pero es útil
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Necesitas esta librería

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private isBrowser: boolean;

  // --- CAMBIO #1: BEHAVIORSUBJECT PARA ESTADO REACTIVO ---
  // Este objeto notificará a toda la app cuando el usuario cambie (login/logout).
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromToken());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Método privado para obtener los datos del usuario a partir del token en localStorage
  private getUserFromToken(): any | null {
    if (this.isBrowser) {
      const token = this.getToken();
      if (token) {
        try {
          return jwtDecode(token);
        } catch (e) {
          // Si el token es inválido, lo borramos
          localStorage.removeItem('access_token');
          return null;
        }
      }
    }
    return null;
  }
  
  // --- CAMBIO #2: MÉTODO PÚBLICO PARA OBTENER EL VALOR ACTUAL DEL USUARIO ---
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  // La función de login no necesita cambiar, ya que la lógica la maneja el componente
  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, userData);
  }

  // --- CAMBIO #3: SETTOKEN AHORA ACTUALIZA EL ESTADO ---
  setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('access_token', token);
      // Notificamos a todos los suscriptores (como el navbar) que el usuario ha cambiado.
      this.currentUserSubject.next(this.getUserFromToken());
    }
  }

  // --- CAMBIO #4: LOGOUT AHORA ACTUALIZA EL ESTADO ---
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    // Notificamos que ya no hay usuario.
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('access_token');
    }
    return null;
  }
  
  // --- CAMBIO #5: ISLOGGEDIN AHORA USA EL ESTADO REACTIVO ---
  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
  
  // --- CAMBIO #6: ¡EL NUEVO MÉTODO PARA VERIFICAR EL ROL! ---
  isOrganizer(): boolean {
    // Devuelve true solo si hay un usuario y su rol es 'organizer'
    return this.isLoggedIn() && this.currentUserValue.rol === 'organizer';
  }
}