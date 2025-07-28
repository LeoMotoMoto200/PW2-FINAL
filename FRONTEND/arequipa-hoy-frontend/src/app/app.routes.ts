import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DetalleEventoComponent } from './eventos/detalle-evento/detalle-evento.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard'; 
import { organizerGuard } from './guards/organizer.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: HomeComponent,  canActivate: [authGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'eventos/:id',component: DetalleEventoComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [organizerGuard] },
  { path: '**', redirectTo: '' } 
];