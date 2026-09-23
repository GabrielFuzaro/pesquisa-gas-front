import { Component } from '@angular/core';
import { Historico } from 'src/app/interfaces/dto/historico';
import { HistoricoService } from 'src/app/routes/historico.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { firstValueFrom } from 'rxjs';
import { HistoricoCompetencias } from 'src/app/interfaces/dto/historico-competencias';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HistoricoPorMes } from 'src/app/interfaces/dto/historico-por-mes';
import { InformacoesHistorico } from 'src/app/interfaces/dto/informacoes-historico';

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
  mostrarTabelaMenorPreco = false;
  informacoesHistorico: InformacoesHistorico[] = [];
  competenciaSelecionada: HistoricoCompetencias | null = null;
  menorPrecoHistorico: HistoricoPorMes[] = [];
  mediaPreco = 0;
  variacaoPreco = '0.00%';
  menorPreco = 0;

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

  if (
    this.competenciaSelecionada?.mes === competencia.mes &&
    this.competenciaSelecionada?.ano === competencia.ano
  ) {
    this.mostrarTabela = false;
    this.mostrarTabelaMenorPreco = false;
    this.competenciaSelecionada = null;
    return;
  }

  try {

    // Mantém a tabela de menor preço por Estabelecimento
    await this.carregarMenorPreco(
      competencia.mes,
      competencia.ano
    );

    // Carrega os históricos da competência
    const response = await firstValueFrom(
      this.historicoService.buscarHistoricosPorMesEspecifico(
        competencia.mes,
        competencia.ano
      )
    );

    this.historicos = response;

    // Calcula o resumo
    this.menorPreco = this.calcularMenorPreco();
    this.mediaPreco = this.calcularMediaPreco();
    this.variacaoPreco = this.calcularVariacaoPreco();

    this.competenciaSelecionada = competencia;

    this.mostrarTabelaMenorPreco = true;
    this.mostrarTabela = false;

  } catch (error) {
    this.notifier.showError('Erro ao buscar histórico do mês');
  }
}

  async alternarTabelaGeral(): Promise<void> {
  if (this.mostrarTabela) {
    this.mostrarTabela = false;
    return;
  }

  if (!this.competenciaSelecionada) return;
  this.mostrarTabela = true;
}

async carregarMenorPreco(mes: number, ano: number): Promise<void> {
  try {
    const response = await firstValueFrom(
      this.historicoService.buscarMenorPrecoAtuais(0, 1, 'ASC', mes, ano)
    );

    this.menorPrecoHistorico = response.content;
  } catch (error) {
    this.notifier.showError('Erro ao buscar menor preço do mês');
  }
}

estaSelecionada(competencia: HistoricoCompetencias): boolean {
  return this.competenciaSelecionada?.mes === competencia.mes &&
         this.competenciaSelecionada?.ano === competencia.ano;
}

  calcularMediaPreco(): number {

    const precos = this.historicos.flatMap(historico => historico.informacoes.map(informacao => informacao.preco));
    
    if(precos.length === 0) {
      return 0;
    }

    const soma = precos.reduce((total, preco) => total + preco, 0);

    return soma / precos.length;
  }

  calcularVariacaoPreco(): string {
    const todosPrecos = this.historicos.flatMap(h => h.informacoes.map(i => i.preco));

    if(todosPrecos.length === 0) return '0.00%';

    const menor = Math.min(...todosPrecos);
    const maior = Math.max(...todosPrecos);

    if(menor === 0) return '0.00%';

    const porcentagem = ((maior-menor) / menor) * 100;

    return `${porcentagem.toFixed(2)}%`;
  }

  calcularMenorPreco() {
    const todosPrecos = this.historicos.flatMap(h => h.informacoes.map(i => i.preco));

    if(todosPrecos.length === 0) return 0;

    const menor = Math.min(...todosPrecos);

    return menor;
  }



}
