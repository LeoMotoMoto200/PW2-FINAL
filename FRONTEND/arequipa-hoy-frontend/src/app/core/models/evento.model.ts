// src/app/core/models/evento.model.ts

// --- ¡NUEVO! Definimos la interfaz de paginación aquí ---
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// --- Interfaces para los modelos de apoyo ---
export interface Categoria {
  id: number;
  nombre: string;
  color: string;
}

export interface Lugar {
  id: number;
  nombre: string;
  direccion: string;
  mapa_url?: string;
}

export interface Organizador {
  id: number;
  nombre: string;
  contacto?: string;
}

// --- ¡EL MODELO DE EVENTO 100% CORRECTO Y COMPLETO! ---
export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  imagen: string | null;
  creador_username: string;
  creado_en: string;
  actualizado_en: string;

  // Campos para escritura (los IDs que enviamos al backend)
  categoria?: number | null;
  lugar?: number | null;
  organizador?: number | null;

  // ¡AQUÍ ESTÁ LA MAGIA! Campos de solo lectura con la info completa
  // El '?' los hace opcionales, por si un evento no tiene categoría, etc.
  categoria_info?: Categoria;
  lugar_info?: Lugar;
  organizador_info?: Organizador;
}