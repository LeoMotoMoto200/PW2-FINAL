import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CorreoService } from '../services/correo.service';

@Component({
  selector: 'app-correo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './correo.component.html',
  styleUrls: ['./correo.component.css']
})
export class CorreoComponent {
  @Input() eventoId!: number;

  destinatario: string = '';
  respuesta: string | null = null;

  constructor(private correoService: CorreoService) {}

  enviarCorreo(): void {
    if (!this.destinatario) {
      this.respuesta = 'Todos los campos son obligatorios.';
      return;
    }

    this.correoService.enviarCorreo(this.eventoId, this.destinatario).subscribe({
      next: res => this.respuesta = res.mensaje || 'Enviado.',
      error: err => this.respuesta = err.error?.error || 'Error al enviar.'
    });
  }
}
