import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Evento, PaginatedResponse } from '../../core/models/evento.model'; 
import { EventService } from '../../services/event.service';
import { CategoriaService } from '../../services/categoria.service';
import { LugarService } from '../../services/lugar.service';
import { OrganizadorService } from '../../services/organizador.service';
import { Categoria } from '../../core/models/categoria.model';

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
  categorias: Categoria[] = [];
  lugares: any[] = [];
  organizadores: any[] = [];
  
  eventModel: any = this.getInitialEventModel();
  selectedImage: File | null = null;
  editMode = false;
  isLoading = true;
  
  constructor(
    private eventService: EventService,
    private categoriaService: CategoriaService,
    private lugarService: LugarService,
    private organizadorService: OrganizadorService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadEvents({});
    this.loadDropdownData();
  }

loadDropdownData(): void {
  this.categoriaService.getCategorias().subscribe((data: any) => {
    this.categorias = data.results || data;
  });
  this.lugarService.getLugares().subscribe((data: any) => {
    this.lugares = data.results || data;
  });
  this.organizadorService.getOrganizadores().subscribe((data: any) => {
    this.organizadores = data.results || data;
  });
}

  loadEvents(filtros: any): void {
    this.isLoading = true;
    this.eventService.getEvents(filtros).subscribe({
      next: (data: PaginatedResponse<Evento>) => {
        this.events = data.results; 
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error('No se pudieron cargar los eventos.', 'Error de Red');
        console.error('Error al cargar eventos:', err);
        this.isLoading = false;
      }
    });
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  onFormSubmit(): void {
    if (this.editMode) {
      this.eventService.updateEvent(this.eventModel.id, this.eventModel).subscribe({
        next: () => {
          this.toastr.success('Evento actualizado correctamente.', '¡Éxito!');
          this.loadEvents({});
          this.cancelEdit();
        },
        error: (err: any) => this.toastr.error('Error al actualizar el evento.', 'Error')
      });
    } else {
      const formData = new FormData();
      Object.keys(this.eventModel).forEach(key => {
        if (this.eventModel[key] !== null && this.eventModel[key] !== '') {
          formData.append(key, this.eventModel[key]);
        }
      });
      if (this.selectedImage) {
        formData.append('imagen', this.selectedImage, this.selectedImage.name);
      }
      
      this.eventService.addEvent(formData).subscribe({
        next: () => {
          this.toastr.success('Evento creado correctamente.', '¡Éxito!');
          this.loadEvents({});
          this.resetForm();
        },
        error: (err: any) => this.toastr.error('Error al crear el evento.', 'Error')
      });
    }
  }

  editEvent(event: any): void {
    this.editMode = true;
    this.eventModel = { 
      id: event.id,
      titulo: event.titulo,
      descripcion: event.descripcion,
      fecha: event.fecha,
      hora: event.hora,
      categoria: event.categoria_info?.id || null,
      lugar: event.lugar_info?.id || null,
      organizador: event.organizador_info?.id || null,
    };
    window.scrollTo(0, 0);
  }

  cancelEdit(): void {
    this.editMode = false;
    this.resetForm();
  }
  
  resetForm(): void {
    this.eventModel = this.getInitialEventModel();
    this.selectedImage = null;
    const fileInput = document.getElementById('imagen') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  deleteEvent(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.toastr.info('Evento eliminado.', 'Operación Exitosa');
          this.loadEvents({});
        },
        error: (err: any) => this.toastr.error('Error al eliminar el evento.', 'Error')
      });
    }
  }
  
  private getInitialEventModel() {
    return {
      titulo: '',
      descripcion: '',
      fecha: '',
      hora: '',
      categoria: null,
      lugar: null,
      organizador: null,
    };
  }
}