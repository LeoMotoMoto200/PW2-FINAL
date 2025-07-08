// En src/app/core/models/evento.model.ts (o en un nuevo archivo api-response.model.ts)
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }
// src/app/core/models/evento.model.ts
export interface Evento {
    id: number;
    titulo: string; // <-- CORREGIDO: de 'nombre' a 'titulo'
    descripcion: string;
    fecha: string;      // <-- CORREGIDO: El backend envía 'fecha' y 'hora'
    hora: string;
    lugar: any;         // Pongo 'any' porque parece ser un objeto anidado
    categoria: any;     // Igual aquí
    organizador: any;
    imagen: string | null; // <-- El backend envía 'imagen'
  }

// Interfaz para la respuesta paginada
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }