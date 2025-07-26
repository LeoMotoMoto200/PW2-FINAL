// frontend/src/app/services/categoria.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../core/models/categoria.model'; // Importa el modelo que acabas de crear

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  // La URL del backend que creamos en el Paso 1
  private apiUrl = 'https://arequipa-hoy-backend.onrender.com/api/categorias';

  constructor(private http: HttpClient) { }

  // Método para obtener todas las categorías
  getCategorias(): Observable<any> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }
}