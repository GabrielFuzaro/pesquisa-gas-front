import { Injectable } from '@angular/core';

import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { TelaService } from '../routes/tela.service';
import { Tela } from '../interfaces/dto/tela';

@Injectable({
  providedIn: 'root',
})
export class TelaObservableService {
  constructor(private telaService: TelaService) { }

  telasVariablesSubject = new BehaviorSubject<Tela[]>([]);
  telasVariables$ = this.telasVariablesSubject.asObservable();
  telasAll: { [key: string]: string } = {};
  telaAdmin: Tela[] = [];

  initTelas() {
    if (this.telasVariablesSubject == null || this.telasVariablesSubject.value.length == 0) {
      firstValueFrom(this.telaService.getAll())
        .then((response: Tela[]) => {
          this.telaAdmin = response;
          const telasVariables = response.map((el: Tela) => {
            const key = el.identificador.toUpperCase().replace(/-/g, '_');
            this.telasAll[key] = el.identificador;
            return el;
          });
          this.telasVariablesSubject.next(telasVariables);
        })
        .catch((err) => {
          console.error('Erro ao carregar telas:', err);
        });
    }
  }
}
