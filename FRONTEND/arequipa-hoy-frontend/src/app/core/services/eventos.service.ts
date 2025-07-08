// src/app/core/services/eventos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // <-- IMPORTA map DE rxjs/operators
import { Evento } from '../models/evento.model';
import { PaginatedResponse } from '../models/evento.model'; // O donde la hayas guardado

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = 'http://127.0.0.1:8000/api/eventos/';

  constructor(private http: HttpClient) { }

  // Método para obtener todos los eventos (CORREGIDO)
  getEventos(): Observable<Evento[]> {
    return this.http.get<PaginatedResponse<Evento>>(this.apiUrl).pipe(
      map(response => response.results) // <-- Extraemos solo el array 'results'
    );
  }
  
  // El método para obtener un solo evento por ID debería funcionar bien,
  // porque las vistas de detalle de DRF no suelen estar paginadas.
  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}${id}/`);
  }
}