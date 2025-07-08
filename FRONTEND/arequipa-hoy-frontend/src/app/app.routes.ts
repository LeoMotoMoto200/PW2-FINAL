import { Routes } from '@angular/router';
import { ListadoEventos } from './eventos/listado-eventos/listado-eventos';
import { DetalleEvento } from './eventos/detalle-evento/detalle-evento';

export const routes: Routes = [
    { path: '', redirectTo: 'eventos', pathMatch: 'full' },
    { path: 'eventos', component: ListadoEventos },
    { path: 'eventos/:id', component: DetalleEvento }
];
