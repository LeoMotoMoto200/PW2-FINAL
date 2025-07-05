import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroBusqueda } from './filtro-busqueda';

describe('FiltroBusqueda', () => {
  let component: FiltroBusqueda;
  let fixture: ComponentFixture<FiltroBusqueda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroBusqueda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltroBusqueda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
