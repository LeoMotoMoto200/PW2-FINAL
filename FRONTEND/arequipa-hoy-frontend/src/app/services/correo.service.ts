import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {
  private apiUrl = 'https://arequipa-hoy-backend.onrender.com/api/eventos/';

  constructor(private http: HttpClient) {}

  enviarCorreo(eventoId: number, destinatario: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventoId}/enviar-correo/`, { destinatario: destinatario });
  }
}
