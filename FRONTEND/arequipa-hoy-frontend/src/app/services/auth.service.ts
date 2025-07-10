// --- IMPORTACIONES ---
// Añadimos Inject y PLATFORM_ID para detectar el entorno.
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Esta función es la clave.
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  // Esta variable guardará 'true' si estamos en un navegador, 'false' si estamos en el servidor.
  private isBrowser: boolean;

  constructor(
    private http: HttpClient, 
    private router: Router,
    // --- CAMBIO #1: INYECTAR PLATFORM_ID ---
    // Inyectamos el 'PLATFORM_ID' de Angular para saber dónde corre nuestro código.
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // --- CAMBIO #2: DETERMINAR EL ENTORNO ---
    // Usamos la función isPlatformBrowser para saber si estamos en un navegador.
    // Esto se ejecuta solo una vez, cuando el servicio se crea.
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // --- La función de register no cambia, no usa localStorage ---
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  // --- La función de login ahora es más inteligente ---
  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, userData).pipe(
      tap((response: any) => {
        // --- CAMBIO #3: GUARDAR SOLO EN EL NAVEGADOR ---
        // Antes de intentar guardar, preguntamos: ¿estamos en un navegador?
        if (this.isBrowser) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
        }
      })
    );
  }

  // --- La función de logout ahora es más inteligente ---
  logout(): void {
    // --- CAMBIO #4: BORRAR SOLO EN EL NAVEGADOR ---
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    // La redirección sí la hacemos siempre.
    this.router.navigate(['/login']);
  }

  // --- La función de getToken ahora es más inteligente ---
  getToken(): string | null {
    // --- CAMBIO #5: LEER SOLO EN EL NAVEGADOR ---
    if (this.isBrowser) {
      return localStorage.getItem('access_token');
    }
    // Si estamos en el servidor, no puede haber token, devolvemos null.
    return null;
  }

  // --- La función de isLoggedIn ahora es más inteligente ---
  isLoggedIn(): boolean {
    // --- CAMBIO #6: LA LÓGICA COMPLETA ---
    // La doble negación (!!) convierte el resultado de getToken() en un booleano.
    // Si estamos en el servidor, getToken() devuelve null, entonces !!null es false.
    // Si estamos en el navegador, getToken() devuelve el token o null, y !! funciona como antes.
    return !!this.getToken();
  }
}