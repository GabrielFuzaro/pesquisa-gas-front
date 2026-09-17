import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarEstabelecimentosFiltroComponent } from './buscar-estabelecimentos-filtro.component';

describe('BuscarEstabelecimentosFiltroComponent', () => {
  let component: BuscarEstabelecimentosFiltroComponent;
  let fixture: ComponentFixture<BuscarEstabelecimentosFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarEstabelecimentosFiltroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarEstabelecimentosFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
