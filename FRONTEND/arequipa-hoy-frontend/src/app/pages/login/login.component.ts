// src/app/pages/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importa RouterModule para routerLink
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastr: ToastrService 
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
        this.router.navigate(['/home']); // Redirige a la página principal
    }
  }

  onSubmit() {
    if (!this.model.username || !this.model.password) {
      this.toastr.warning('Por favor, ingresa tu usuario y contraseña.', 'Campos incompletos');
      return;
    }

    this.authService.login(this.model).subscribe({
      next: () => {
        // El servicio ya guardó el token y actualizó el estado.r.
        this.toastr.success(`¡Bienvenido, ${this.authService.currentUserValue.username}!`, 'Login Exitoso');

        if (this.authService.isOrganizer()) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/']); 
        }
      },
      error: (err) => {
        this.toastr.error('Usuario o contraseña incorrectos.', 'Error de Autenticación');
        this.errorMessage = 'No se pudo iniciar sesión. Verifica tus credenciales.';
        console.error('Error de login:', err);
      }
    });
  }
}