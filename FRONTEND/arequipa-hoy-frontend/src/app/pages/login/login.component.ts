import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
      next: () => {
        // Si el login es exitoso, lo mandamos al dashboard.
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Usuario o contraseña incorrectos.';
        console.error('Error de login:', err);
      }
    });
  }
}