import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; 
import { PaginatedResponse, Evento } from '../core/models/evento.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'https://arequipa-hoy-backend.onrender.com/api/eventos/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Crea las cabeceras de autorización.
   * Detecta si se va a enviar un FormData para omitir el 'Content-Type'.
   */
  private getAuthHeaders(isFormData: boolean = false): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      // Si no hay token, no podemos hacer peticiones autenticadas.
      return new HttpHeaders();
    }
    
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    if (!isFormData) {
      // Si no es un FormData, especificamos que enviaremos JSON.
      headers = headers.append('Content-Type', 'application/json');
    }
    // Si SÍ es un FormData, dejamos que el navegador ponga el 'Content-Type'
    // con el 'boundary' correcto para la subida de archivos.
    return headers;
  }
   getPublicEvents(): Observable<Evento[]> {
    return this.http.get<PaginatedResponse<Evento>>(this.apiUrl, { 
      headers: this.getAuthHeaders() // O sin cabeceras si es 100% público
    }).pipe(
      map(response => response.results) 
    );
  }

  /**
   * Obtiene la lista de eventos. Acepta un objeto de filtros para construir la URL.
   * Devuelve un Observable del tipo PaginatedResponse.
   */
  getEvents(filtros: any = {}): Observable<PaginatedResponse<any>> {
    let params = new HttpParams();
    for (const key in filtros) {
      // Solo añadimos los filtros que tienen un valor (no son null, undefined o string vacío).
      if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
        params = params.append(key, filtros[key].toString());
      }
    }
    
    return this.http.get<PaginatedResponse<any>>(this.apiUrl, { 
      headers: this.getAuthHeaders(), 
      params: params 
    });
  }

  /**
   * Obtiene los detalles de un solo evento por su ID.
   * Útil para una página de "Ver Detalle".
   */
  getEvent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }

  /**
   * Agrega un nuevo evento. Acepta un FormData para poder subir la imagen.
   */
  addEvent(eventData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, eventData, { headers: this.getAuthHeaders(true) });
  }

  /**
   * Actualiza un evento existente por su ID.
   * Enviamos un objeto JSON, ya que manejar la actualización de la imagen
   * con PUT es más complejo (generalmente se usa PATCH o un endpoint separado).
   */
  updateEvent(id: number, eventData: any): Observable<any> {
    // Construimos el payload con los campos que tu backend espera (los IDs de las relaciones).
    const payload = {
      titulo: eventData.titulo,
      descripcion: eventData.descripcion,
      fecha: eventData.fecha,
      hora: eventData.hora,
      categoria: eventData.categoria, 
      lugar: eventData.lugar,        
      organizador: eventData.organizador,
    };
    return this.http.put(`${this.apiUrl}${id}/`, payload, { headers: this.getAuthHeaders() });
  }

  /**
   * Elimina un evento por su ID.
   */
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }
}