// src/app/eventos/detalle-evento/detalle-evento.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // <-- Añadir RouterLink
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs'; // <-- Importar Observable y of
import { catchError, switchMap } from 'rxjs/operators'; // <-- Importar catchError y switchMap
import { CorreoComponent } from '../../correo/correo.component'

import { EventosService } from '../../core/services/eventos.service';
import { Evento } from '../../core/models/evento.model';

@Component({
  selector: 'app-detalle-evento',
  standalone: true,
  // Añadimos RouterLink para poder tener un botón de "Volver"
  imports: [CommonModule, RouterLink, CorreoComponent], 
  templateUrl: './detalle-evento.html',
  styleUrls: ['./detalle-evento.css']
})
export class DetalleEventoComponent implements OnInit {

  // Declaramos un Observable de tipo Evento (o null)
  evento$!: Observable<Evento | null>;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventosService: EventosService
  ) { }

  ngOnInit(): void {
    // Usamos el observable 'paramMap' para reaccionar a cambios en la URL
    this.evento$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          // Si hay un ID, llamamos al servicio. El resultado (Evento) se pasará por el pipe.
          return this.eventosService.getEventoById(+id).pipe(
            catchError(err => {
              console.error('Error al obtener el evento:', err);
              this.error = "No se pudo encontrar el evento. Es posible que ya no exista.";
              // Devolvemos un observable de null para que el pipe no se rompa.
              return of(null);
            })
          );
        } else {
          // Si no hay ID en la URL, devolvemos un observable de null.
          this.error = "No se especificó un ID de evento.";
          return of(null);
        }
      })
    );
  }
}