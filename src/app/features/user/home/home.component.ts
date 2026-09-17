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

  competenciaFormulario = new FormGroup({
    competencia: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
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
}
