// src/app/eventos/detalle-evento/detalle-evento.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs'; 
import { catchError, switchMap } from 'rxjs/operators'; 
import { CorreoComponent } from '../../correo/correo.component'
import { EventosService } from '../../core/services/eventos.service';
import { Evento } from '../../core/models/evento.model';

@Component({
  selector: 'app-detalle-evento',
  standalone: true,
  imports: [CommonModule, RouterLink, CorreoComponent], 
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css']
})
export class DetalleEventoComponent implements OnInit {

  // Declaramos un Observable de tipo Evento (o null)
  evento$!: Observable<Evento | null>;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventosService: EventosService,
    private routeNlogin: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()){
      this.routeNlogin.navigate(['/']);
      return;
    }

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