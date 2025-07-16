// frontend/src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- IMPORTACIONES NECESARIAS ---
import { EventService } from '../../services/event'; // Renombra si tu servicio se llama así
import { CategoriaService } from '../../services/categoria.service'; // Necesitarás este servicio
import { LugarService } from '../../services/lugar.service'; // <-- NUEVO
import { OrganizadorService } from '../../services/organizador.service'; // <-- NUEVO
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
    categoria_id: null,
    lugar_id: null, // <-- NUEVO
    organizador_id: null, // <-- Campo obligatorio
  };
  selectedImage: File | null = null;
  // Array para las categorías del <select>
  categorias: Categoria[] = [];
  lugares: any[] = []; // <-- NUEVO
  organizadores: any[] = [];

  editMode = false;
  isLoading = true;

  constructor(
    private eventService: EventService,
    private categoriaService: CategoriaService,
    private lugarService: LugarService, // <-- Inyectar
    private organizadorService: OrganizadorService, // <-- Inyectar el servicio de categorías
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadEvents();
    this.loadInitialData(); // <-- Cargar categorías al iniciar
  }

  loadInitialData(): void {
    this.categoriaService.getCategorias().subscribe(data => this.categorias = data.results || data);
    this.lugarService.getLugares().subscribe(data => this.lugares = data.results || data);
    this.organizadorService.getOrganizadores().subscribe(data => this.organizadores = data.results || data);
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

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  onFormSubmit(): void {
    // --- LÓGICA MEJORADA para manejar archivos ---
    const formData = new FormData();
    
    // Añadimos todos los campos del modelo al FormData
    // Object.keys itera sobre las propiedades de eventModel ('titulo', 'descripcion', etc.)
    Object.keys(this.eventModel).forEach(key => {
      if (this.eventModel[key] !== null && this.eventModel[key] !== '') {
        formData.append(key, this.eventModel[key]);
      }
    });

    // Si se seleccionó una imagen, la añadimos también
    if (this.selectedImage) {
      formData.append('imagen', this.selectedImage, this.selectedImage.name);
    }
    
    if (this.editMode) {
      // La actualización con archivos es más compleja (requiere PUT o PATCH),
      // por ahora la dejamos con los datos de texto.
      this.eventService.updateEvent(this.eventModel.id, this.eventModel).subscribe(() => {
        this.loadEvents();
        this.cancelEdit();
      });
    } else {
      // Enviamos el objeto FormData en lugar de un JSON simple
      this.eventService.addEvent(formData).subscribe(() => {
        this.loadEvents();
        this.resetForm();
      });
    }
  }

  editEvent(event: any): void {
    this.editMode = true;
    this.eventModel = { ...event }; 
    // Aseguramos que los IDs de las relaciones se asignen correctamente
    this.eventModel.categoria_id = event.categoria?.id; 
    this.eventModel.lugar_id = event.lugar?.id;
    this.eventModel.organizador_id = event.organizador?.id;
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


  cancelEdit(): void {
    this.editMode = false;
    this.resetForm();
  }
  
  resetForm(): void {
    this.eventModel = {
      titulo: '',
      descripcion: '',
      fecha: '',
      hora: '',
      categoria_id: null,
      lugar_id: null,
      organizador_id: null,
    };
    this.selectedImage = null;
    // Resetea el input de archivo si lo tienes en un formulario
    const fileInput = document.getElementById('imagen') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  deleteEvent(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      this.eventService.deleteEvent(id).subscribe(() => {
        this.loadEvents();
      });
    }
  }
}