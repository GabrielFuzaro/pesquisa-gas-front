import { Component } from '@angular/core';
import { HistoricoPreco } from 'src/app/interfaces/dto/historico-preco';
import { HistoricoService } from 'src/app/routes/historico.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-buscar-historicos-filtro',
  templateUrl: './buscar-historicos-filtro.component.html',
  styleUrls: ['./buscar-historicos-filtro.component.css']
})
export class BuscarHistoricosFiltroComponent {

  constructor(private historicoService: HistoricoService, private notifier: NotifierService) {}

  historicos: HistoricoPreco[] = [];

  ngOnInit(): void{
    this.buscarHistoricos();
  }

  async buscarHistoricos() {
    try{
      this.historicos = await firstValueFrom(
        this.historicoService.buscarHistoricosATuais()
      );
    } catch (error){
      this.notifier.showError('Erro ao buscar históricos')
    }
  }

}
