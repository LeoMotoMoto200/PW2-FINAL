import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Arequipa Hoy';
  isScrolled = false;
  
  // Hacemos el servicio 'public' para poder usar 'authService.isLoggedIn()' en el HTML
  constructor(public authService: AuthService) {}
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  // --- ¡AQUÍ ESTÁ LA FUNCIÓN QUE FALTABA! ---
  logout(): void {
    this.authService.logout();
  }
  
  // También la función getYear para el footer
  getYear(): number {
    return new Date().getFullYear();
  }
}