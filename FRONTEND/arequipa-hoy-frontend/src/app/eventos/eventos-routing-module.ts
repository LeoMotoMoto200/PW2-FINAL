import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoEventos } from './listado-eventos/listado-eventos';
import { DetalleEventoComponent } from './detalle-evento/detalle-evento.component';

const routes: Routes = [
  { path: '', component: ListadoEventos },
  { path: 'evento/:id', component: DetalleEventoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
