import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { LugarService } from '../../services/lugar.service';
import { OrganizadorService } from '../../services/organizador.service';
import { Categoria } from '../../core/models/categoria.model';

@Component({
  selector: 'app-filtro-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtro-busqueda.component.html',
  styleUrls: ['./filtro-busqueda.component.css']
})
export class FiltroBusquedaComponent implements OnInit {

  // Propiedades para guardar los datos que vienen de la API
  categorias: Categoria[] = [];
  lugares: any[] = [];
  organizadores: any[] = [];

  // Modelo que guarda los valores seleccionados por el usuario
  filtros = {
    categoria: null,
    lugar: null,
    organizador: null,
    search: ''
  };

  // Evento que notifica al componente padre (Home) cuando algo cambia
  @Output() filtrosCambiados = new EventEmitter<any>();

  constructor(
    private categoriaService: CategoriaService,
    private lugarService: LugarService,
    private organizadorService: OrganizadorService
  ) { }

  // Al iniciar, el componente pide los datos para sus dropdowns.
  ngOnInit(): void {
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.categoriaService.getCategorias().subscribe((data: any) => this.categorias = data.results || data);
    this.lugarService.getLugares().subscribe((data: any) => this.lugares = data.results || data);
    this.organizadorService.getOrganizadores().subscribe((data: any) => this.organizadores = data.results || data);
  }

  // Se llama cada vez que el usuario cambia un filtro en el HTML.
  onFilterChange(): void {
    // Emite el objeto completo de filtros al componente Home.
    this.filtrosCambiados.emit(this.filtros);
  }
}