// src/app/pages/home/home.component.ts (VERSIÓN FINAL)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service'; // Importa PaginatedResponse

import { Evento, PaginatedResponse } from '../../core/models/evento.model';
import { FiltroBusquedaComponent } from '../../eventos/filtro-busqueda/filtro-busqueda.component'; // ¡IMPORTANTE!
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FiltroBusquedaComponent], // ¡Añádelo aquí!
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  public eventos: Evento[] = [];
  public isLoading = true;

  constructor(
    private eventoService: EventService, 
    public authService: AuthService,
    private toastr: ToastrService // Inyectamos para notificaciones
  ) {}

  ngOnInit(): void {
    // Carga inicial sin filtros
    this.loadEventos({});
  }

  loadEventos(filtros: any): void {
    this.isLoading = true;
    this.eventoService.getEvents(filtros).subscribe({
      next: (data: PaginatedResponse<Evento>) => { // Usamos el tipo Evento para más seguridad
        this.eventos = data.results; 
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error('No se pudieron cargar los eventos.', 'Error de Red');
        console.error('Error al cargar los eventos para el home:', err);
        this.isLoading = false;
      }
    });
  }

  // Esta función recibe los filtros del componente hijo
  onFiltrosCambiados(nuevosFiltros: any): void {
    this.loadEventos(nuevosFiltros);
  }
}