import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DetalleEvento } from './eventos/detalle-evento/detalle-evento';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard] 
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'event/:id', 
    component: DetalleEvento,
    canActivate: [authGuard] 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' } 
];