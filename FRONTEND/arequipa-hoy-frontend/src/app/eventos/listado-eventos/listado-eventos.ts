import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor
import { RouterModule } from '@angular/router'; // Necesario para routerLink
import { EventosService } from '../../core/services/eventos.service'; // <-- Ruta actualizada
import { Evento } from '../../core/models/evento.model';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-listado-eventos',
  standalone: true, // Esto indica que el componente gestiona sus propias dependencias
  imports: [CommonModule, RouterModule, RouterLink], // Importamos los módulos aquí
  templateUrl: './listado-eventos.html', // Corregí el nombre para seguir la convención
  styleUrl: './listado-eventos.css'
})
export class ListadoEventos implements OnInit{
  // Aquí creamos la lista de eventos simulados tal como dice la guía
  eventos: Evento[] = []; // Variable para guardar la lista de eventos
  error: string | null = null; // Variable para manejar errores

  // Inyectamos el servicio en el constructor
  constructor(private eventosService: EventosService) { }

  // ngOnInit se ejecuta una vez que el componente se ha inicializado
  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.eventosService.getEventos().subscribe({
      next: (data) => {
        this.eventos = data;
        console.log('Eventos cargados:', this.eventos); // Para depurar en la consola
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
        this.error = 'No se pudieron cargar los eventos. ¿El servidor de Django está funcionando?';
      }
    });
  }

}