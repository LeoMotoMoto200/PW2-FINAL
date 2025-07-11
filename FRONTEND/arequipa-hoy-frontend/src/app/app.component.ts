// frontend/src/app/app.component.ts (CORREGIDO Y SIMPLIFICADO)

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Arequipa Hoy';

  // Hacemos el servicio público para que la plantilla HTML pueda acceder a sus métodos
  // como `isLoggedIn()` y `isOrganizer()`.
  constructor(public authService: AuthService) {}

  // El método logout() ya no es necesario aquí, lo llamaremos directamente
  // desde el HTML para mantener el código más limpio.

  getYear(): number {
    return new Date().getFullYear();
  } 
}