import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  // ¡CORRECCIÓN CLAVE!
  // El modelo ahora SÍ incluye el campo 'rol' y le damos un valor por defecto.
  model: any = {
    rol: 'normal' // Por defecto, estará seleccionado "Usuario".
  };
  
  errorMessage: string = '';
  isLoading: boolean = false; // Para mostrar estado de carga

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastr: ToastrService
  ) { }

  onSubmit() {
    if (!this.model.username || !this.model.email || !this.model.password || !this.model.rol) {
      this.toastr.warning('Por favor, completa todos los campos.', 'Formulario Incompleto');
      return;
    }

    this.isLoading = true;

    // Ahora, el 'this.model' que enviamos contiene el rol seleccionado por el usuario.
    this.authService.register(this.model).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success('¡Tu cuenta ha sido creada!', '¡Registro Exitoso!');
        this.toastr.info('Ahora serás redirigido para iniciar sesión.', 'Siguiente paso');
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.toastr.error('El nombre de usuario o el email ya podrían estar en uso.', 'Error de Registro');
        this.errorMessage = 'No se pudo completar el registro. Intenta con otros datos.';
        console.error('Error de registro:', err);
      }
    });
  }
}