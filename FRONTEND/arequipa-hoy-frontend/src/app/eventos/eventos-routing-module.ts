import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoEventos } from './listado-eventos/listado-eventos';
import { DetalleEvento } from './detalle-evento/detalle-evento';

const routes: Routes = [
  { path: '', component: ListadoEventos },
  { path: 'evento/:id', component: DetalleEvento },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
