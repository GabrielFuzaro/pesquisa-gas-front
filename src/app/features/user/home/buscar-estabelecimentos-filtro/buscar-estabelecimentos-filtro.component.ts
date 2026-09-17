import { Component } from '@angular/core';
import { EstabelecimentoService } from 'src/app/routes/estabelecimento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Estabelecimento } from 'src/app/interfaces/dto/estabelecimento';
import { firstValueFrom } from 'rxjs';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-buscar-estabelecimentos-filtro',
  templateUrl: './buscar-estabelecimentos-filtro.component.html',
  styleUrls: ['./buscar-estabelecimentos-filtro.component.css']
})
export class BuscarEstabelecimentosFiltroComponent {

  constructor(private estabelecimentoService: EstabelecimentoService, private notifier: NotifierService) {}

  estabelecimentoFormulario = new FormGroup({
    nome: new FormControl('', Validators.required)
  })

  estabelecimentos: Estabelecimento[] = []

  ngOnInit(): void{
    this.carregarEstabelecimentos()
  }

  async carregarEstabelecimentos(){
    try{
      const response = await firstValueFrom(
      this.estabelecimentoService.listrEstabelecimentos()
      );

      this.estabelecimentos = response;
    } catch {
      this.notifier.showError('Erro ao carregar Estabelecimentos')
    }
  }
}
