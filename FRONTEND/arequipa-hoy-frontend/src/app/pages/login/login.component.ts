// frontend/src/app/pages/login/login.component.ts (CORREGIDO)

import { Component, OnInit } from '@angular/core'; // Asegúrate de importar OnInit
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit { // Asegúrate de implementar OnInit
  model: any = {};
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  // --- LÓGICA MEJORADA ---
  ngOnInit(): void {
    // Si el usuario ya tiene una sesión válida, no debería estar en la página de login.
    // Lo redirigimos a su página de inicio correspondiente.
    if (this.authService.isLoggedIn()) {
      const user = this.authService.currentUserValue;
      if (user && user.rol === 'organizer') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }

  // Tu método onSubmit ya funciona perfectamente y no necesita cambios.
  onSubmit() {
    this.authService.login(this.model).subscribe({
      next: (response) => {
        const accessToken = response.access;
        if (accessToken) {
          this.authService.setToken(accessToken);
          try {
            const decodedToken: any = jwtDecode(accessToken);
            if (decodedToken.rol === 'organizer') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/home']);
            }
          } catch (error) {
            console.error('Error al decodificar el token:', error);
            this.router.navigate(['/home']);
          }
        }
      },
      error: (err) => {
        this.errorMessage = 'Usuario o contraseña incorrectos.';
        console.error('Error de login:', err);
      }
    });
  }
}