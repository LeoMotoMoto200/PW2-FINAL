import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const organizerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (authService.isOrganizer()) {
    return true; // Es organizador, puede pasar.
  } else {
    toastr.error('No tienes permiso para acceder a esta página.', 'Acceso Denegado');
    router.navigate(['/home']);
    return false; // No es organizador, no puede pasar.
  }
};