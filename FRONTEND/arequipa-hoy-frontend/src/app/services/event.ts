import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  // La URL para el CRUD de eventos.
  private apiUrl = 'http://127.0.0.1:8000/api/eventos/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Crea las cabeceras de autorización para las peticiones protegidas.
   * Esto le dice a Django: "Oye, soy un usuario logueado, aquí está mi token".
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Obtiene la lista de todos los eventos.
   */
  getEvents(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  /**
   * Agrega un nuevo evento.
   */
  addEvent(eventData: any): Observable<any> {
    return this.http.post(this.apiUrl, eventData, { headers: this.getAuthHeaders() });
  }

  /**
   * Actualiza un evento existente por su ID.
   */
  updateEvent(id: number, eventData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, eventData, { headers: this.getAuthHeaders() });
  }

  /**
   * Elimina un evento por su ID.
   */
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }
}