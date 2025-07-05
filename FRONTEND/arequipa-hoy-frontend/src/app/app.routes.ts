import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'eventos', pathMatch: 'full' },
    { path: 'eventos', loadChildren: () => import('./eventos/eventos-module').then(m => m.EventosModule) }
];
