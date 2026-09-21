import { Component, EventEmitter, Output } from '@angular/core';
import { EstabelecimentoService } from 'src/app/routes/estabelecimento.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Estabelecimento } from 'src/app/interfaces/dto/estabelecimento';
import { firstValueFrom } from 'rxjs';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-buscar-estabelecimentos-filtro',
  templateUrl: './buscar-estabelecimentos-filtro.component.html',
  styleUrls: ['./buscar-estabelecimentos-filtro.component.css']
})
export class BuscarEstabelecimentosFiltroComponent {

  constructor(
    private estabelecimentoService: EstabelecimentoService,
    private notifier: NotifierService
  ) {}

  estabelecimentoFormulario = new FormGroup({
    nome: new FormControl('', Validators.required)
  });

  estabelecimentos: Estabelecimento[] = [];
  estabelecimentosFiltrados: Estabelecimento[] = [];

  @Output() estabelecimentoSelecionado = new EventEmitter<number>();

  ngOnInit(): void {
    this.carregarEstabelecimentos();
  }

  async carregarEstabelecimentos() {
    try {
      const response = await firstValueFrom(
        this.estabelecimentoService.listrEstabelecimentos()
      );

      this.estabelecimentos = response;
      this.estabelecimentosFiltrados = response;
    } catch {
      this.notifier.showError('Erro ao carregar Estabelecimentos');
    }
  }

  filtrarEstabelecimentos() {
    const termo = this.estabelecimentoFormulario
      .get('nome')
      ?.value
      ?.toLowerCase()
      .trim() || '';

    this.estabelecimentosFiltrados = this.estabelecimentos.filter(
      estabelecimento =>
        estabelecimento.nome.toLowerCase().includes(termo)
    );
  }

  selecionarEstabelecimento(estabelecimento: Estabelecimento) {
    this.estabelecimentoFormulario
      .get('nome')
      ?.setValue(estabelecimento.nome);

    this.estabelecimentosFiltrados = [];

    this.estabelecimentoSelecionado.emit(estabelecimento.id);
  }
}