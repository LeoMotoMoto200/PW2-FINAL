import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // ¡Importante!
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  model: any = {};
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.login(this.model).subscribe({
      next: (response) => {
        const accessToken = response.access;
        if (accessToken) {
          this.authService.setToken(accessToken);
  
          try {
            const decodedToken: any = jwtDecode(accessToken);
            
            // --- PASO DE DEPURACIÓN ---
            // Imprime en la consola el token decodificado para ver qué contiene
            console.log('Token decodificado:', decodedToken);
            console.log('Rol detectado:', decodedToken.rol);
            
            if (decodedToken.rol === 'organizer') {
              console.log('Redirigiendo a /dashboard...');
              this.router.navigate(['/dashboard']);
            } else {
              console.log('Redirigiendo a /home...');
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