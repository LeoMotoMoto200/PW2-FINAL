import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const organizerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  // Revisa si el usuario tiene el rol de organizador.
  if (authService.isOrganizer()) {
    return true; // ¡Adelante, VIP!
  } else {
    // Si no es organizador...
    toastr.error('No tienes los permisos necesarios para acceder a esta página.', 'Acceso Denegado');
    router.navigate(['/home']); // Lo mandamos a la página principal.
    return false; // ¡No puedes pasar!
  }
};