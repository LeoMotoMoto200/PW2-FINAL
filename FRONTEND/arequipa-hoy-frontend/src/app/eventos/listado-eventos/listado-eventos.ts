// src/app/eventos/listado-eventos/listado-eventos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 

import { EventosService } from '../../core/services/eventos.service';
import { Evento } from '../../core/models/evento.model';

@Component({
  selector: 'app-listado-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listado-eventos.html',
  styleUrls: ['./listado-eventos.css']
})
export class ListadoEventos implements OnInit {

  // En lugar de un array, declaramos un Observable de un array de eventos
  public eventos$!: Observable<Evento[]>;
  public error: string | null = null;

  constructor(private eventosService: EventosService) { }

  ngOnInit(): void {
    this.eventos$ = this.eventosService.getEventos().pipe(
      catchError(err => {
        console.error('Error al cargar eventos:', err);
        this.error = 'No se pudieron cargar los eventos. Por favor, revisa la conexión con el servidor.';
        // Devolvemos un observable con un array vacío para que el pipe async no falle
        return of([]); 
      })
    );
  }
}