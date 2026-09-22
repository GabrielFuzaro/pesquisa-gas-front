import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { HistoricoService } from 'src/app/routes/historico.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { HistoricoPorMes } from 'src/app/interfaces/dto/historico-por-mes';
import { firstValueFrom } from 'rxjs';
import { InformacoesHistorico } from 'src/app/interfaces/dto/informacoes-historico';
import { Historico } from 'src/app/interfaces/dto/historico';

@Component({
  selector: 'app-buscar-historicos-filtro',
  templateUrl: './buscar-historicos-filtro.component.html',
  styleUrls: ['./buscar-historicos-filtro.component.css']
})
export class BuscarHistoricosFiltroComponent implements OnChanges {

  constructor(
    private historicoService: HistoricoService,
    private notifier: NotifierService
  ) {}

  historicos: HistoricoPorMes[] = [];
  historicoTodos: Historico[] = [];
  informacoes: InformacoesHistorico[] = [];
  filtroAplicado = false;

  @Input() mes?: number;
  @Input() ano?: number;
  @Input() estabelecimentoId?: number;
  @Input() filtrosAplicados = 0;

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['filtrosAplicados'] && this.mes && this.ano){
      this.filtroAplicado = true;
      this.buscarHistoricosFiltrados();
    }
  }

  ngOnInit(): void {
    this.buscarTodosHistoricos();
  }

  async buscarTodosHistoricos() {
    try{
      const response = await firstValueFrom(
      this.historicoService.buscarTodosHistoricos());

      this.historicoTodos = response.content;

    } catch (error) {
      this.notifier.showError("Erro ao carregar Históricos")
    }
  }

  async buscarHistoricosFiltrados() {

    try {

      const response = await firstValueFrom(
        this.historicoService.buscarMenorPrecoAtuais(
          0,
          10,
          'ASC',
          this.mes!,
          this.ano!,
          this.estabelecimentoId
        )
      );

      this.historicos = response.content;

    } catch (error) {

      this.notifier.showError('Erro ao buscar históricos');

    }
  }
}