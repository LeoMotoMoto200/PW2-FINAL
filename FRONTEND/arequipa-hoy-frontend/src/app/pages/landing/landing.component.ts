// frontend/src/app/pages/landing/landing.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Necesario para los botones [routerLink]

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink], // Importamos RouterLink
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  // No necesitamos lógica aquí por ahora. El componente solo muestra HTML estático.
  constructor() { }
}