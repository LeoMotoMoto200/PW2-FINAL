// src/app/core/models/evento.model.ts

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

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

  categoria?: number | null;
  lugar?: number | null;
  organizador?: number | null;

  // El '?' los hace opcionales, por si un evento no tiene categoría, etc.
  categoria_info?: Categoria;
  lugar_info?: Lugar;
  organizador_info?: Organizador;
}