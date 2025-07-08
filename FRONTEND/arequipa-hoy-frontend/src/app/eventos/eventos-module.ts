import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EventosRoutingModule } from './eventos-routing-module';

import { ListadoEventos } from './listado-eventos/listado-eventos';
import { DetalleEvento } from './detalle-evento/detalle-evento';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    EventosRoutingModule,
    ListadoEventos,
    DetalleEvento
  ]
})
export class EventosModule { }
