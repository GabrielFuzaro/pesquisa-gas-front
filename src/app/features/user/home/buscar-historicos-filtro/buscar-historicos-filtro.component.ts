import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { HistoricoService } from 'src/app/routes/historico.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { HistoricoPorMes } from 'src/app/interfaces/dto/historico-por-mes';
import { firstValueFrom } from 'rxjs';

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

  @Input() mes?: number;
  @Input() ano?: number;
  @Input() estabelecimentoId?: number;
  @Input() filtrosAplicados = 0;

  ngOnChanges(changes: SimpleChanges): void {

    if (
      (changes['mes']) ||
      changes['ano'] || 
      changes['estabelecimentoId'] &&
      this.mes &&
      this.ano
    ) {
      this.buscarHistoricosFiltrados();
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