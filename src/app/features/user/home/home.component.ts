import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HistoricoCompetencias } from 'src/app/interfaces/dto/historico-competencias';
import { HistoricoService } from 'src/app/routes/historico.service';
import { firstValueFrom } from 'rxjs';
import { NotifierService } from 'src/app/services/notifier.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router, private historicoService: HistoricoService, private notifier: NotifierService) {}

  competencias: HistoricoCompetencias[] = [];
  mesSelecionado?: number;
  anoSelecionado?: number;
  estabelecimentoSelecionado?: number;
  tamanhoSelecionado?: number;
  mesAplicado?: number;
  anoAplicado?: number;
  estabelecimentoAplicado?: number;
  tamanhoAplicado?: number;


  competenciaFormulario = new FormGroup({
    competencia: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    const dataAtual = new Date();

    this.mesSelecionado = dataAtual.getMonth() + 1;
    this.anoSelecionado = dataAtual.getFullYear();

    this.mesAplicado = this.mesSelecionado;
    this.anoAplicado = this.anoSelecionado;

    this.carregarCompetencias()
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

    filtrarCompetencia(event: { mes: number; ano: number }) {
    this.mesSelecionado = event.mes;
    this.anoSelecionado = event.ano;
  }

  filtrarEstabelecimento(id: number) {
    this.estabelecimentoSelecionado = id;
  }

  filtrarTamanho(id: number){
    this.tamanhoSelecionado = id;
  }

  filtrosAplicados = 0;
  
  aplicarFiltros() {
    this.mesAplicado = this.mesSelecionado;
    this.anoAplicado = this.anoSelecionado;
    this.estabelecimentoAplicado = this.estabelecimentoSelecionado;
    this.tamanhoAplicado = this.tamanhoSelecionado;
    this.filtrosAplicados++;
  }
}
