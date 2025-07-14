import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Esta es la nueva forma de crear guardias en Angular, se le conoce como Guardia Funcional.
export const authGuard: CanActivateFn = (route, state) => {
  
  // 'inject' nos permite usar nuestros servicios aquí.
  const authService = inject(AuthService);
  const router = inject(Router);

  // Preguntamos al servicio: ¿El usuario está logueado?
  if (authService.isLoggedIn()) {
    return true; // Si la respuesta es SÍ, le permitimos el paso.
  } else {
    // Si la respuesta es NO, lo mandamos a la página de login.
    router.navigate(['/login']);
    return false; // Y le negamos el paso a la ruta protegida.
  }
};