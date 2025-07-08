// src/app/core/models/evento.model.ts
export interface Evento {
    id: number;
    nombre: string;
    descripcion: string;
    fecha_inicio: string; // Django envía las fechas como strings en formato ISO
    fecha_fin: string;
    lugar: string;
    categoria: string; // Asumiendo que por ahora es un string simple
    organizador: string;
    imagen_url?: string; // Opcional por si no todos los eventos tienen imagen
  }