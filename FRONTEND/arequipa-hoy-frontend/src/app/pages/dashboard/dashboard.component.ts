import { Component, OnInit } from '@angular/core';
// El import de EventService debe terminar en .service si seguiste el estándar. Revisa el nombre de tu archivo.
import { EventService } from '../../services/event'; 
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  events: any[] = [];
  eventModel: any = {};
  editMode = false;
  isLoading = true; // <-- CAMBIO #1: Añadimos la variable de estado de carga y la iniciamos en 'true'.

  // El constructor está bien, pero he añadido el formateo de fecha al constructor
  // para que esté disponible en todo el componente, aunque tu forma también funciona.
  constructor(private eventService: EventService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true; // <-- CAMBIO #2: Antes de llamar a la API, ponemos 'isLoading' en true.
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false; // <-- CAMBIO #3: Cuando los datos llegan, ponemos 'isLoading' en false.
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
        this.isLoading = false; // <-- CAMBIO #4: ¡Importante! Si hay un error, también dejamos de cargar.
      }
    });
  }

  onFormSubmit(): void {
    // Esta parte de tu código está perfecta. La dejamos igual.
    if (this.eventModel.date) {
        this.eventModel.date = this.datePipe.transform(this.eventModel.date, 'yyyy-MM-dd');
    }

    if (this.editMode) {
      this.eventService.updateEvent(this.eventModel.id, this.eventModel).subscribe(() => {
        this.loadEvents();
        this.cancelEdit();
      });
    } else {
      this.eventService.addEvent(this.eventModel).subscribe(() => {
        this.loadEvents();
        this.eventModel = {};
      });
    }
  }

  // El resto de tus funciones (editEvent, cancelEdit, deleteEvent) están perfectas.
  // No necesitan cambios.
  editEvent(event: any): void {
    this.editMode = true;
    this.eventModel = { ...event };
  }

  cancelEdit(): void {
    this.editMode = false;
    this.eventModel = {};
  }

  deleteEvent(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      this.eventService.deleteEvent(id).subscribe(() => {
        this.loadEvents();
      });
    }
  }
}