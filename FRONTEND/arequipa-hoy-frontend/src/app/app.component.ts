import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // Importamos RouterLink para usar routerLink en el HTML
import { AuthService } from './services/auth.service'; // Importamos nuestro servicio de autenticación

@Component({
  selector: 'app-root',
  standalone: true,
  // ¡Asegúrate de que RouterOutlet y RouterLink estén en los imports!
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Arequipa Hoy';

  // Inyectamos el AuthService en el constructor para poder usarlo en la plantilla HTML.
  // Lo declaramos como 'public' para que sea accesible desde el template.
  constructor(public authService: AuthService) {}

  // Creamos una función de logout para llamarla desde el botón.
  logout(): void {
    this.authService.logout();
  }
  getYear(): number {
    return new Date().getFullYear();
  } 
}