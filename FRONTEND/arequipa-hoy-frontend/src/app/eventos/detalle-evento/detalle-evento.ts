import { Component } from '@angular/core';

@Component({
  selector: 'app-detalle-evento',
  imports: [],
  templateUrl: './detalle-evento.html',
  styleUrl: './detalle-evento.css'
})
export class DetalleEvento {
  evento = {
    id: 1,
    titulo: 'Concierto Sinfónico',
    descripcion: 'Una presentación inolvidable con orquesta completa.',
    fecha: '2025-07-12',
    hora: '19:00',
    lugar: 'Teatro Municipal',
    imagen: 'https://via.placeholder.com/600x300',
    categoria: 'Cultural',
  };
}
