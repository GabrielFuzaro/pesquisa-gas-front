import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, // Representa o estado da rota no momento em que o guarda é ativado.
  Router, // Serviço que permite navegação programática dentro da aplicação.
  RouterStateSnapshot, // Representa o estado do roteador no momento em que o guarda é ativado.
  UrlTree, // Representa uma árvore de URLs que pode ser retornada para redirecionar a navegação.
} from '@angular/router';

import { Observable, switchMap } from 'rxjs';

import { LoginService } from '../routes/login.service'; // Serviço que gerencia o estado de autenticação do usuário.
import { NotifierService } from '../services/notifier.service'; // Serviço para exibir notificações.
import { TokenJwtService } from '../services/token-jwt.service'; // Serviço para manipulação e verificação de tokens JWT.
import { Claims } from '../interfaces/dto/claims'; // Interface que define a estrutura dos Claims do JWT.
import { rolesENUM } from '../const/rolesENUM';

@Injectable({
  providedIn: 'root', // O serviço é registrado na raiz da aplicação, tornando-o um singleton.
})
export class ProfileGuardService {
  constructor(
    private loginService: LoginService, // Injeção do serviço de login.
    private router: Router, // Injeção do serviço de roteamento.
    private notifier: NotifierService, // Injeção do serviço de notificações.
    private token: TokenJwtService // Injeção do serviço de tokens JWT.
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
    return this.checkUserLogin(next, url); // Chama o método para verificar se o usuário está autenticado e autorizado.
  }

  // Método para verificar se o usuário está autenticado e tem permissão para acessar a rota.
  checkUserLogin(route: ActivatedRouteSnapshot, url: any): Observable<boolean> {
    return this.loginService.verifyToken().pipe( // Verifica se o token JWT é válido.
      switchMap(() => {
        const idEdit = route.params['id']; // Obtém o parâmetro 'id' da rota.

        return this.loginService.obterClaims().pipe( // Obtém os claims do token JWT.
          switchMap(async (res: Claims) => { // Processa os claims.
            const response = res;
            const idLogin = response.id; // Obtém o ID do usuário logado a partir dos claims.
            const userRole = await this.token.getRole(); // Obtém o papel (role) do usuário logado.

            if (userRole === rolesENUM.ROLE_ADMIN) { // Se o usuário for um administrador, concede acesso.
              return true;
            } else {
              if (idLogin == idEdit) { // Se o ID do usuário logado for igual ao ID do perfil que ele está tentando acessar, concede acesso.
                return true;
              } else {
                this.notifier.showError(
                  'Você não tem permissão para acessar essa página' // Exibe um erro se o usuário não tiver permissão.
                );
                return false; // Nega o acesso se o ID não corresponder.
              }
            }
          })
        );
      })
    );
  }
}
