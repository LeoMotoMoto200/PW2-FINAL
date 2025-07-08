import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Eventos } from '../eventos';


@Component({
  selector: 'app-detalle-evento',
  imports: [],
  templateUrl: './detalle-evento.html',
  styleUrl: './detalle-evento.css'
})
export class DetalleEvento implements OnInit{
  evento = {
    id: 1,
    titulo: 'Concierto Sinfónico',
    descripcion: 'Una presentación inolvidable con orquesta completa.',
    fecha: '2025-07-12',
    hora: '19:00',
    lugar: 'Teatro Municipal',
    imagen: 'https://via.placeholder.com/600x300',
    categoria: 'Cultural',
  };
  constructor(
    private route: ActivatedRoute,
    private eventosService: Eventos
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventosService.getEvento(id).subscribe(data => {
      this.evento = data;
    });
  }

  descargarPDF(): void {
    const id = this.evento.id;
    this.eventosService.descargarPDF(id).subscribe(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `evento_${id}.pdf`;
      link.click();
    });
  }
}
