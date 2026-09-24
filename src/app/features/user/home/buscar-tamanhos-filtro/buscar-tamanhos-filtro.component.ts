import { Component, EventEmitter, Output } from '@angular/core';
import { TamanhoBotijaoService } from 'src/app/routes/tamanho-botijao.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { TamanhoBotijao } from 'src/app/interfaces/dto/tamanho-botijao';
import { firstValueFrom } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-buscar-tamanhos-filtro',
  templateUrl: './buscar-tamanhos-filtro.component.html',
  styleUrls: ['./buscar-tamanhos-filtro.component.css']
})
export class BuscarTamanhosFiltroComponent {

  constructor(private tamanhoService: TamanhoBotijaoService, private notifier: NotifierService) {}

  tamanhos: TamanhoBotijao[] = [];

  @Output() tamanhoSelecionado = new EventEmitter<number | undefined>();

  tamanhoFormulario = new FormGroup({
    tamanho: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    this.carregarTamanhos()
  }

  async carregarTamanhos() {
    try {
      const response = await firstValueFrom(
        this.tamanhoService.listarTamanhos()
      );
      this.tamanhos = response;
    } catch (error) {
      this.notifier.showError("Erro ao buscar tamanhos para o filtro")
    }
  }

    selecionarTamanho(valor: string): void {
      const tamanho = valor === '' ? undefined : Number(valor);
      this.tamanhoSelecionado.emit(tamanho);
    }
}
