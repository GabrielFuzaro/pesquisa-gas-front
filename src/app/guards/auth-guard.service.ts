import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, // Representa uma árvore de URLs que pode ser retornada para redirecionar a navegação.
  UrlTree
} from '@angular/router';

import { Observable } from 'rxjs';

import { rolesENUM } from 'src/app/const/rolesENUM'; // Enumeração que define os diferentes papéis (roles) de usuários na aplicação.
import { RoleTelaObservableService } from '../observables/role-tela-observable.service'; // Serviço observável para roles de telas.
import { LoginService } from '../routes/login.service'; // Serviço de login para autenticação.
import { NotifierService } from '../services/notifier.service'; // Serviço para exibir notificações.
import { TokenJwtService } from '../services/token-jwt.service'; // Serviço para manipulação e verificação de tokens JWT.
import { PermissionsGuardService } from './permissions-guard.service'; // Serviço para manipular permissões do usuário.

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    private loginService: LoginService, // Serviço de login, usado para gerenciar o estado de autenticação.
    private notifier: NotifierService, // Serviço de notificações, usado para exibir mensagens ao usuário.
    private token: TokenJwtService, // Serviço JWT para manipulação de tokens de autenticação.
    private roleTelaService: RoleTelaObservableService, // Serviço para observar e manipular as permissões das telas com base nas roles.
    private permissions: PermissionsGuardService // Serviço para verificar e gerenciar permissões de acesso.
  ) {}

  // Método `canActivate` é chamado para determinar se uma rota pode ser ativada ou não.
  canActivate(
    next: ActivatedRouteSnapshot, // Representa a rota que está tentando ser acessada.
  ):
    | Observable<boolean | UrlTree> // Pode retornar um Observable que emite um booleano ou uma UrlTree.
    | Promise<boolean | UrlTree> // Pode retornar uma Promise que resolve para um booleano ou uma UrlTree.
    | boolean // Pode retornar um booleano diretamente.
    | UrlTree { // Pode retornar uma UrlTree diretamente para redirecionamento.
    return this.checkUserLogin(next); // Chama o método para verificar se o usuário está autenticado e tem permissão.
  }

  // Método para verificar o login do usuário e suas permissões.
  async checkUserLogin(
    route: ActivatedRouteSnapshot, // Representa a rota que está sendo acessada.
  ): Promise<boolean | UrlTree> { // Retorna uma Promise que resolve para um booleano ou uma UrlTree.
    const token = this.token.getToken(); // Obtém o token JWT do usuário.

    if (!token || this.token.isTokenExpired(String(token))) {
      this.loginService.logout();
      return false;
    }

    try {
      const userRole = await this.token.getRole();

      // Administrador sempre pode acessar.
      if (userRole === rolesENUM.ROLE_ADMIN) {
        return true;
      }

      await this.roleTelaService.initRoleTela();
      const roleTelaList = this.roleTelaService.getRoleTelaSnapshot();
      const routeIdentifier = route.data['routeIdentifier'];

      const roleTela = roleTelaList?.find(
        (item) => item.identificador === routeIdentifier && item.role === userRole
      );

      if (!roleTela) {
        this.notifier.showError('Você não tem permissão para acessar essa página');
        return false;
      }

      this.permissions.setPermissions(roleTela);
      await this.permissions.verifyPermissions();

      const permission = this.verificarQualPermissaoUsuarioPossui(
        route,
        this.permissions.getPermissionSnapshot()
      );

      if (!permission) {
        this.notifier.showError('Você não tem permissão para acessar essa página');
        return false;
      }

      return true;
    } catch (error) {
      this.loginService.logout();
      return false;
    }
  }

  private verificarQualPermissaoUsuarioPossui(
    route: ActivatedRouteSnapshot,
    permissionFlags: { created: boolean; edit: boolean; deleted: boolean; info: boolean }
  ): boolean {
    if (
      route.data['typePath'] != null &&
      route.data['typePath'] !== '' &&
      route.data['typePath'] != undefined
    ) {
      if (permissionFlags.created && route.data['typePath'] == 'create') {
        return true;
      }

      if (permissionFlags.edit && route.data['typePath'] == 'edit') {
        return true;
      }

      if (permissionFlags.deleted && route.data['typePath'] == 'delete') {
        return true;
      }

      if (permissionFlags.info && route.data['typePath'] == 'info') {
        return true;
      }

      return false;
    }

    return true; // Se não houver tipo de caminho, concede permissão.
  }
}
