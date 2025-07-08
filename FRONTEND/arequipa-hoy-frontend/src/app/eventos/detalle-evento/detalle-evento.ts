import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventosService } from '../../core/services/eventos.service';
import { Evento } from '../../core/models/evento.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-detalle-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-evento.html',
  styleUrl: './detalle-evento.css'
})
export class DetalleEvento implements OnInit{
  evento: Evento | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventosService: EventosService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtiene el 'id' de la URL
    if (id) {
      this.eventosService.getEventoById(+id).subscribe({ // el '+' convierte el string a número
        next: (data) => this.evento = data,
        error: (err) => this.error = "No se pudo encontrar el evento."
      });
    }
  }
}
