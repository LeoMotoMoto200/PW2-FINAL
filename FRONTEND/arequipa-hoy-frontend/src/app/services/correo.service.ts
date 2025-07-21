import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {
  private apiUrl = 'http://127.0.0.1:8000/api/eventos';

  constructor(private http: HttpClient) {}

  enviarCorreo(eventoId: number, destinatario: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventoId}/enviar-correo/`, { destinatario: destinatario });
  }
}
