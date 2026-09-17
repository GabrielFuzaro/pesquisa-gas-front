import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarHistoricosFiltroComponent } from './buscar-historicos-filtro.component';

describe('BuscarHistoricosFiltroComponent', () => {
  let component: BuscarHistoricosFiltroComponent;
  let fixture: ComponentFixture<BuscarHistoricosFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarHistoricosFiltroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarHistoricosFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
