// src/app/pages/register/register.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importa RouterModule para routerLink
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr'; // Para notificaciones

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Añade RouterModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // El modelo ya no necesita el campo 'rol'
  model: any = {};
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastr: ToastrService // Inyecta el servicio de notificaciones
  ) { }

  onSubmit() {
    // Pequeña validación para asegurar que los campos no estén vacíos
    if (!this.model.username || !this.model.email || !this.model.password) {
      this.toastr.warning('Por favor, completa todos los campos.', 'Formulario Incompleto');
      return;
    }

    this.authService.register(this.model).subscribe({
      next: () => {
        // Reemplazamos el alert() por una notificación más profesional.
        this.toastr.success('¡Tu cuenta ha sido creada!', '¡Registro Exitoso!');
        this.toastr.info('Ahora serás redirigido para iniciar sesión.', 'Siguiente paso');
        
        // Redirigimos al login después de un pequeño retraso para que se lean los toasts.
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // 2 segundos de espera
      },
      error: (err) => {
        // Mejoramos el manejo de errores.
        this.toastr.error('El nombre de usuario o el email ya podrían estar en uso.', 'Error de Registro');
        this.errorMessage = 'No se pudo completar el registro. Por favor, intenta con otros datos.';
        console.error('Error de registro:', err);
      }
    });
  }
}