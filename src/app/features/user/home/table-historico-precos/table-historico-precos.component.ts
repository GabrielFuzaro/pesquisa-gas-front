import { Component } from '@angular/core';
import { Historico } from 'src/app/interfaces/dto/historico';
import { HistoricoService } from 'src/app/routes/historico.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { firstValueFrom } from 'rxjs';
import { HistoricoCompetencias } from 'src/app/interfaces/dto/historico-competencias';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HistoricoPorMes } from 'src/app/interfaces/dto/historico-por-mes';
import { InformacoesHistorico } from 'src/app/interfaces/dto/informacoes-historico';
import { TamanhoBotijao } from 'src/app/interfaces/dto/tamanho-botijao';
import { TamanhoBotijaoService } from 'src/app/routes/tamanho-botijao.service';

@Component({
  selector: 'app-table-historico-precos',
  templateUrl: './table-historico-precos.component.html',
  styleUrls: ['./table-historico-precos.component.css']
})
export class TableHistoricoPrecosComponent {

  constructor(
    private historicoService: HistoricoService,
    private notifier: NotifierService,
    private tamanhoService: TamanhoBotijaoService
  ) {}

  historicos: Historico[] = [];
  tamanhos: TamanhoBotijao[] = [];
  competencias: HistoricoCompetencias[] = [];
  mostrarTabela: boolean = false;
  mostrarTabelaMenorPreco = false;
  informacoesHistorico: InformacoesHistorico[] = [];
  competenciaSelecionada: HistoricoCompetencias | null = null;
  menorPrecoHistorico: HistoricoPorMes[] = [];
  mediaPreco = 0;
  variacaoPreco = '0.00%';
  menorPreco = 0;
  tamanhoSelecionado?: TamanhoBotijao;

  mes: number = 0;
  ano: number = 0;

  competenciaFormulario = new FormGroup({
    competencia: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    this.carregarHistoricos();
    this.carregarCompetencias();
    this.carregarTamanhos();
  }

  async carregarHistoricos() {
    try {
      this.historicos = await firstValueFrom(
        this.historicoService.buscarHistoricosPorMesEspecifico(this.mes!, this.ano!)
      );
    } catch (error) {
      this.notifier.showError('Erro ao carregar Historicos por mês');
    }
  }

  async carregarCompetencias() {
    try {
      const response = await firstValueFrom(
        this.historicoService.buscarHistoricoCompetencias()
      );
      this.competencias = response;
    } catch (error) {
      this.notifier.showError('Erro ao buscar competências');
    }
  }

  async carregarTamanhos() {
    try {
      const response = await firstValueFrom(
        this.tamanhoService.listarTamanhos()
      );
      this.tamanhos = response;
    } catch (error) {
      this.notifier.showError('Erro ao carregar tamanhos de botijão');
    }
  }

  async carregarMenorPreco(mes: number, ano: number): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.historicoService.buscarMenorPrecoAtuais(
          0, 1, 'ASC', mes, ano, undefined, this.tamanhoSelecionado?.id
        )
      );
      this.menorPrecoHistorico = response.content;
    } catch (error) {
      this.notifier.showError('Erro ao buscar menor preço do mês');
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

    this.competenciaSelecionada = competencia;
    await this.buscarDadosCompetencia(competencia.mes, competencia.ano);
  }

  async selecionarTamanho(tamanho: TamanhoBotijao): Promise<void> {
    this.tamanhoSelecionado = tamanho;

    if (!this.competenciaSelecionada) return;

    await this.buscarDadosCompetencia(
      this.competenciaSelecionada.mes,
      this.competenciaSelecionada.ano
    );
  }

  private async buscarDadosCompetencia(mes: number, ano: number): Promise<void> {
    try {
      await this.carregarMenorPreco(mes, ano);

      const response = await firstValueFrom(
        this.historicoService.buscarHistoricosPorMesEspecifico(
          mes,
          ano,
          this.tamanhoSelecionado?.id
        )
      );

      this.historicos = response;

      this.menorPreco = this.calcularMenorPreco();
      this.mediaPreco = this.calcularMediaPreco();
      this.variacaoPreco = this.calcularVariacaoPreco();

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

  estaSelecionada(competencia: HistoricoCompetencias): boolean {
    return this.competenciaSelecionada?.mes === competencia.mes &&
           this.competenciaSelecionada?.ano === competencia.ano;
  }

  calcularMediaPreco(): number {
    if (!this.tamanhoSelecionado) return 0;

    const precos = this.historicos
      .flatMap(historico => historico.informacoes)
      .filter(informacao => informacao.tamanhoCodigo === this.tamanhoSelecionado!.codigo)
      .map(informacao => informacao.preco);

    if (precos.length === 0) {
      return 0;
    }

    const soma = precos.reduce((total, preco) => total + preco, 0);
    return soma / precos.length;
  }

  calcularVariacaoPreco(): string {
    if (!this.tamanhoSelecionado) return '0.00%';

    const precos = this.historicos
      .flatMap(h => h.informacoes)
      .filter(i => i.tamanhoCodigo === this.tamanhoSelecionado!.codigo)
      .map(i => i.preco);

    if (precos.length === 0) return '0.00%';

    const menor = Math.min(...precos);
    const maior = Math.max(...precos);

    if (menor === 0) return '0.00%';

    const porcentagem = ((maior - menor) / menor) * 100;
    return `${porcentagem.toFixed(2)}%`;
  }

  calcularMenorPreco(): number {
    if (!this.tamanhoSelecionado) return 0;

    const precos = this.historicos
      .flatMap(h => h.informacoes)
      .filter(i => i.tamanhoCodigo === this.tamanhoSelecionado!.codigo)
      .map(i => i.preco);

    if (precos.length === 0) return 0;

    return Math.min(...precos);
  }
}