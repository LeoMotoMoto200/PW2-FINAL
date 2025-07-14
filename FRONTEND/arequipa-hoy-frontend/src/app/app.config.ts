// frontend/src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 

// --- CORRIGE ESTA IMPORTACIÓN ---
// Importa la función, no la clase (que ya no existe)
import { authInterceptor } from './interceptors/auth.interceptor'; 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimations(),
    provideToastr({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    
    provideHttpClient(
      // Ahora sí coincide: withInterceptors espera una función,
      // y le estás pasando la función authInterceptor.
      withInterceptors([authInterceptor]) 
    ),
  ]
};