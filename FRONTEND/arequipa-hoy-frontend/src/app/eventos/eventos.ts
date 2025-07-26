import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Eventos {
  private apiUrl = 'https://arequipa-hoy-backend.onrender.com/api/eventos/';

  constructor(private http: HttpClient) {}

  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEvento(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  descargarPDF(id: number): Observable<Blob> {
    return this.http.get(`/api/eventos/${id}/pdf/`, { responseType: 'blob' });
  }
}
