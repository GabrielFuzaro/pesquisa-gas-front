import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHistoricoPrecosComponent } from './table-historico-precos.component';

describe('TableHistoricoPrecosComponent', () => {
  let component: TableHistoricoPrecosComponent;
  let fixture: ComponentFixture<TableHistoricoPrecosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableHistoricoPrecosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableHistoricoPrecosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
