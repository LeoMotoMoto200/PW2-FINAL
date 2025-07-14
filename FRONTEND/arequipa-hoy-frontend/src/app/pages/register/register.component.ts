import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Necesario para formularios (ngModel)
import { CommonModule } from '@angular/common'; // Necesario para directivas (*ngIf)

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule], // ¡Importante añadir esto!
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  model: any = {
    rol: 'normal'
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.register(this.model).subscribe({
      next: () => {
        alert('¡Registro exitoso! Ahora por favor inicia sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Mostramos un mensaje genérico de error
        this.errorMessage = 'Error en el registro. El usuario o email podría ya existir.';
        console.error('Error de registro:', err);
      }
    });
  }
}