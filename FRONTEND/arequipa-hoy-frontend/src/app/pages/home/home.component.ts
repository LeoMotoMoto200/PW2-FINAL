// frontend/src/app/pages/home/home.component.ts (CORREGIDO)

import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// --- IMPORTACIONES NECESARIAS ---
import { EventService } from '../../services/event'; // Asegúrate de la ruta a tu servicio de eventos
import { Evento } from '../../core/models/evento.model'; // Importa tu modelo de Evento si lo tienes

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit { // Implementa OnInit
  
  // --- NUEVAS PROPIEDADES ---
  public eventos: Evento[] = []; // Array para guardar los eventos que llegan de la API
  public isLoading = true; // Variable para mostrar un spinner de carga

  // Inyectamos el EventoService para poder usarlo
  constructor(private eventoService: EventService) {}

  // ngOnInit es un método que se ejecuta automáticamente cuando el componente se carga
  ngOnInit(): void {
    this.loadEventos();
  }

  // --- NUEVA FUNCIÓN PARA CARGAR LOS EVENTOS ---
  loadEventos(): void {
    this.isLoading = true; // Mostramos el spinner
    this.eventoService.getEvents().subscribe({
      next: (data: any) => {
        // Asignamos el array de 'results' que viene de la API paginada de Django
        this.eventos = data.results; 
        this.isLoading = false; // Ocultamos el spinner
      },
      error: (err) => {
        console.error('Error al cargar los eventos para el home:', err);
        this.isLoading = false; // Ocultamos el spinner incluso si hay error
      }
    });
  }
}