// ... otros imports
import { Component } from '@angular/core';

@Component({
  selector: 'app-filtro-busqueda',
  standalone: true, // <-- ¡AÑADE ESTA LÍNEA!
  imports: [/* aquí van los módulos que necesite, como CommonModule o FormsModule */],
  templateUrl: './filtro-busqueda.html', // <-- Asegúrate de que los nombres de archivo sean correctos
  styleUrl: './filtro-busqueda.css'
})
export class FiltroBusqueda {
  // ...
}