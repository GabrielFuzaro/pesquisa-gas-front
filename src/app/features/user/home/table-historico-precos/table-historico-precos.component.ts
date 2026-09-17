import { Component } from '@angular/core';
import { Historico } from 'src/app/interfaces/dto/historico';
import { HistoricoService } from 'src/app/routes/historico.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { firstValueFrom } from 'rxjs';
import { HistoricoCompetencias } from 'src/app/interfaces/dto/historico-competencias';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-table-historico-precos',
  templateUrl: './table-historico-precos.component.html',
  styleUrls: ['./table-historico-precos.component.css']
})
export class TableHistoricoPrecosComponent {

  constructor(private historicoService: HistoricoService, private notifier: NotifierService) {}

  historicos: Historico[] = [];
  competencias: HistoricoCompetencias[] = [];
  mostrarTabela:boolean = false;
  competenciaSelecionada: HistoricoCompetencias | null = null;

  ngOnInit(): void{
    this.carregarHistoricos();
    this.carregarCompetencias();
  }

  competenciaFormulario = new FormGroup({
    competencia: new FormControl('', Validators.required)
  })

  mes: number = 0;
  ano: number = 0;

  async carregarHistoricos() {
    try{
      this.historicos = await firstValueFrom(
        this.historicoService.buscarHistoricosPorMesEspecifico(this.mes, this.ano)
      );
    }catch(error) {
      this.notifier.showError('Erro ao carregar Historicos por mês');
    }
  }

  async carregarCompetencias(){
    try{
      const response = await firstValueFrom(
        this.historicoService.buscarHistoricoCompetencias()
      );

      this.competencias = response
    } catch (error){
      this.notifier.showError('Erro ao buscar competências')
    }
  }

  async selecionarCompetencia(competencia: HistoricoCompetencias): Promise<void> {
    // se clicou no mesmo mês que já está selecionado, fecha a tabela (toggle)
    if (this.competenciaSelecionada?.mes === competencia.mes &&
        this.competenciaSelecionada?.ano === competencia.ano) {
      this.mostrarTabela = false;
      this.competenciaSelecionada = null;
      return;
    }

    try {
      const response = await firstValueFrom(
        this.historicoService.buscarHistoricosPorMesEspecifico(competencia.mes, competencia.ano)
      );

      this.historicos = response;
      this.competenciaSelecionada = competencia;
      this.mostrarTabela = true;
    } catch (error) {
      this.notifier.showError('Erro ao buscar histórico do mês');
    }
  }

}
