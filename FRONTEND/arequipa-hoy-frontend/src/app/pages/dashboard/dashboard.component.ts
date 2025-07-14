// frontend/src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- IMPORTACIONES NECESARIAS ---
import { EventService } from '../../services/event'; // Renombra si tu servicio se llama así
import { CategoriaService } from '../../services/categoria.service'; // Necesitarás este servicio
import { Categoria } from '../../core/models/categoria.model'; // Y el modelo correspondiente

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  events: any[] = [];
  // --- CAMBIO #1: Usar los nombres de campo del backend ---
  eventModel: any = {
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '',
    categoria_id: null // <-- Campo obligatorio
  };
  
  // Array para las categorías del <select>
  categorias: Categoria[] = [];

  editMode = false;
  isLoading = true;

  constructor(
    private eventService: EventService,
    private categoriaService: CategoriaService, // <-- Inyectar el servicio de categorías
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadEvents();
    this.loadCategorias(); // <-- Cargar categorías al iniciar
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (data:any) => {
        this.events = data.results;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
        this.isLoading = false;
      }
    });
  }

  // --- NUEVA FUNCIÓN ---
  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data: any) => {
        // Si la API de categorías también está paginada
        if (data.results) {
          this.categorias = data.results;
        } else {
          // Si devuelve un array simple
          this.categorias = data;
        }
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  onFormSubmit(): void {
    // --- CAMBIO #2: El datePipe ya no es necesario si el input es type="date"
    // El formato 'yyyy-MM-dd' ya es el nativo.

    // Creamos una copia para asegurarnos de enviar solo lo necesario.
    const payload = { ...this.eventModel };

    if (this.editMode) {
      this.eventService.updateEvent(payload.id, payload).subscribe(() => {
        this.loadEvents();
        this.cancelEdit();
      });
    } else {
      // Usamos el payload en lugar del this.eventModel directamente
      this.eventService.addEvent(payload).subscribe(() => {
        this.loadEvents();
        this.resetForm();
      });
    }
  }

  editEvent(event: any): void {
    this.editMode = true;
    // Hacemos una copia para no modificar la lista directamente
    this.eventModel = { ...event }; 
    // Aseguramos que el ngModel del select funcione bien al editar
    this.eventModel.categoria_id = event.categoria.id; 
  }

  cancelEdit(): void {
    this.editMode = false;
    this.resetForm();
  }
  
  // --- NUEVA FUNCIÓN HELPER ---
  resetForm(): void {
    this.eventModel = {
      titulo: '',
      descripcion: '',
      fecha: '',
      hora: '',
      categoria_id: null
    };
  }

  deleteEvent(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      this.eventService.deleteEvent(id).subscribe(() => {
        this.loadEvents();
      });
    }
  }
}