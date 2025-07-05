import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor
import { RouterModule } from '@angular/router'; // Necesario para routerLink

@Component({
  selector: 'app-listado-eventos',
  standalone: true, // Esto indica que el componente gestiona sus propias dependencias
  imports: [CommonModule, RouterModule], // Importamos los módulos aquí
  templateUrl: './listado-eventos.component.html', // Corregí el nombre para seguir la convención
  styleUrl: './listado-eventos.component.css'
})
export class ListadoEventosComponent {

  // Aquí creamos la lista de eventos simulados tal como dice la guía
  eventos = [
    {
      id: 1,
      titulo: 'Concierto Sinfónico',
      categoria: 'Cultural',
      fecha: '2025-07-12',
      imagen: 'https://via.placeholder.com/300x200', // Usé una imagen un poco más grande
      lugar: 'Teatro Municipal',
    },
    {
      id: 2,
      titulo: 'Maratón Arequipa 10K',
      categoria: 'Deportivo',
      fecha: '2025-07-18',
      imagen: 'https://via.placeholder.com/300x200',
      lugar: 'Av. Independencia',
    }
  ];

}