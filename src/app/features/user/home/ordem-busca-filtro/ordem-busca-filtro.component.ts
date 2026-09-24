import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ordem-busca-filtro',
  templateUrl: './ordem-busca-filtro.component.html',
  styleUrls: ['./ordem-busca-filtro.component.css']
})
export class OrdemBuscaFiltroComponent {
  ordem: 'ASC' | 'DESC' = 'ASC';

    @Output() ordemSelecionada = new EventEmitter<'ASC' | 'DESC'>();

    selecionarOrdem(ordem: 'ASC' | 'DESC'): void {
      this.ordem = ordem;
      this.ordemSelecionada.emit(ordem);
    }
}
