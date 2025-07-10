// frontend/src/app/interceptors/auth.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core'; // <-- Importante para la inyección de dependencias
import { AuthService } from '../services/auth.service';

// Esto ya no es una clase, es una función exportada.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Usamos inject() para obtener el AuthService, en lugar de usar un constructor.
  const authService = inject(AuthService);
  
  // El resto de la lógica es exactamente la misma.
  const token = authService.getToken();

  if (token) {
    // Clonamos la petición para añadirle la cabecera.
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Pasamos la petición clonada al siguiente manejador.
    return next(cloned);
  }

  // Si no hay token, la petición sigue su curso sin modificaciones.
  return next(req);
};