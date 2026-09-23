import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, // Representa o estado da rota no momento em que o guarda é ativado.
  RouterStateSnapshot, // Representa o estado do roteador no momento em que o guarda é ativado.
  UrlTree, // Representa uma árvore de URLs que pode ser retornada para redirecionar a navegação.
} from '@angular/router';

import { firstValueFrom, Observable } from 'rxjs';

import { LoginService } from '../routes/login.service'; // Serviço que gerencia o estado de autenticação do usuário.
import { TokenJwtService } from '../services/token-jwt.service'; // Serviço para manipulação e verificação de tokens JWT.

@Injectable({
  providedIn: 'root', // O serviço é registrado na raiz da aplicação, tornando-o um singleton.
})
export class LoginGuardService {
  constructor(
    private loginService: LoginService, // Injeção do serviço de login.
    private token: TokenJwtService // Injeção do serviço para manipulação de tokens JWT.
  ) {}

  // Método `canActivate` é chamado para determinar se uma rota pode ser ativada ou não.
  canActivate(
    next: ActivatedRouteSnapshot, // Representa a rota que está tentando ser acessada.
    state: RouterStateSnapshot // Representa o estado atual da aplicação.
  ):
    | Observable<boolean | UrlTree> // Pode retornar um Observable que emite um booleano ou uma UrlTree.
    | Promise<boolean | UrlTree> // Pode retornar uma Promise que resolve para um booleano ou uma UrlTree.
    | boolean // Pode retornar um booleano diretamente.
    | UrlTree { // Pode retornar uma UrlTree diretamente para redirecionamento.
    const url: string = state.url; // Obtém a URL atual da navegação.
    return this.verifyLogin(next, url); // Chama o método para verificar se o usuário está autenticado.
  }

  // Método para verificar o estado de login do usuário.
  async verifyLogin(route: ActivatedRouteSnapshot, url: any): Promise<boolean> {
    const token = this.token.getToken();

    if (!token || this.token.isTokenExpired(String(token))) {
      this.loginService.logout();
      return false;
    }

    try {
      await firstValueFrom(this.loginService.verifyToken());
      return true;
    } catch (error) {
      this.loginService.logout();
      return false;
    }
  }
}
