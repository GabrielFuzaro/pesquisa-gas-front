import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarCompetenciasFiltroComponent } from './buscar-competencias-filtro.component';

describe('BuscarCompetenciasFiltroComponent', () => {
  let component: BuscarCompetenciasFiltroComponent;
  let fixture: ComponentFixture<BuscarCompetenciasFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarCompetenciasFiltroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarCompetenciasFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
