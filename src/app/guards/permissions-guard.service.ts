import { Injectable, OnInit } from '@angular/core';

import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';

import { rolesENUM } from 'src/app/const/rolesENUM'; // Enumeração que define os diferentes papéis (roles) de usuários na aplicação.
import { RoleTelaService } from '../routes/role-tela.service'; // Serviço para obter dados relacionados a roles e telas.
import { TokenJwtService } from '../services/token-jwt.service'; // Serviço para manipular e verificar tokens JWT.
import { RoleTela } from '../interfaces/dto/role-tela'; // Interface que define a estrutura de RoleTela.
import { TelaObservableService } from '../observables/tela-observable.service'; // Serviço observável para manipular telas.

@Injectable({
  providedIn: 'root', // O serviço é registrado na raiz da aplicação, tornando-o um singleton.
})
export class PermissionsGuardService implements OnInit {
  // BehaviorSubjects para armazenar e emitir informações de permissões.
  permissionsVariablesSubject = new BehaviorSubject<RoleTela[]>([]);
  permissionsVariables$ = this.permissionsVariablesSubject.asObservable();

  pemissaoIdSubject = new BehaviorSubject<number | null>(null);
  pemissaoId$ = this.pemissaoIdSubject.asObservable();

  createdSubject = new BehaviorSubject<boolean>(false);
  created$: Observable<boolean> = this.createdSubject.asObservable();

  infoSubject = new BehaviorSubject<boolean>(false);
  info$: Observable<boolean> = this.infoSubject.asObservable();

  editSubject = new BehaviorSubject<boolean>(false);
  edit$: Observable<boolean> = this.editSubject.asObservable();

  deleteSubject = new BehaviorSubject<boolean>(false);
  delete$: Observable<boolean> = this.deleteSubject.asObservable();

  role: any; // Variável para armazenar a role do usuário.

  constructor(
    private roleTelaService: RoleTelaService, // Serviço para obter roles associadas às telas.
    private tokenJwtService: TokenJwtService, // Serviço para obter e verificar o token JWT.
    private telaService: TelaObservableService // Serviço para manipular dados de telas.
  ) {
    this.initializePermissions(); // Inicializa as permissões assim que o serviço é instanciado.
  }

  // Método privado para inicializar permissões, chamado no construtor.
  private async initializePermissions() {
    try {
      const role = await this.tokenJwtService.getIdRole(); // Obtém a role do usuário.
      const response = await firstValueFrom(this.roleTelaService.getByRole(role));
      const permissionsVariables: RoleTela[] = JSON.parse(JSON.stringify(response)); // Clona a resposta.
      this.permissionsVariablesSubject.next(permissionsVariables); // Emite as permissões para os inscritos.
    } catch (error) {
      console.error(error); // Em caso de erro, loga no console.
    }
  }

  // Método `ngOnInit` que é executado quando o componente é inicializado.
  async ngOnInit() {
    this.role = await this.tokenJwtService.getIdRole(); // Obtém a role do usuário.

    if (this.permissionsVariablesSubject == null || this.permissionsVariablesSubject.value.length == 0) {
      try {
        const data = await firstValueFrom(this.roleTelaService.getByRole(this.role));
        const permissionsVariables: RoleTela[] = [];
        data.forEach((element: RoleTela) => {
          permissionsVariables.push(element);
        });
        this.permissionsVariablesSubject.next(permissionsVariables);
      } catch (error: any) {
        console.error(error);
      }
    }

  }

  // Método para definir as permissões com base na RoleTela.
  setPermissions(roleTela: RoleTela) {
    this.pemissaoIdSubject.next(roleTela.idPermissao); // Emite a permissão atual.
  }

  // Método para obter as permissões atuais.
  getPermissions() {
    return this.pemissaoId$; // Retorna o Observable das permissões.
  }

  // Método para verificar as permissões do usuário e emitir os resultados.
  async verifyPermissions() {
    this.role = await this.tokenJwtService.getIdRole(); // Obtém a role do usuário.

    // Configuração das permissões baseadas em um ID de permissão.
    type PermissionConfig = {
      [key: number]: {
        created: boolean;
        edit: boolean;
        info: boolean;
        delete: boolean;
      };
    };

    // Configuração padrão de permissões com base em IDs.
    const config: PermissionConfig = {
      1: { created: false, edit: false, info: true, delete: false },
      2: { created: true, edit: false, info: true, delete: false },
      3: { created: true, edit: true, info: true, delete: false },
      4: { created: true, edit: true, info: true, delete: true },
      0: { created: false, edit: false, info: false, delete: false },
    };
    const permissionId = this.pemissaoIdSubject.value ?? 0;
    let permission = config[permissionId] ?? config[0];

    // Se o usuário for um administrador, concede todas as permissões.
    if (this.role === rolesENUM.ID_ADMIN) {
      permission = config[4];
    }

    // Emite as permissões específicas (criação, edição, visualização, exclusão).
    this.createdSubject.next(permission.created);
    this.editSubject.next(permission.edit);
    this.infoSubject.next(permission.info);
    this.deleteSubject.next(permission.delete);
  }

  getPermissionSnapshot() {
    return {
      created: this.createdSubject.value,
      edit: this.editSubject.value,
      deleted: this.deleteSubject.value,
      info: this.infoSubject.value,
    };
  }

  roleId = 0; // Variável para armazenar o ID da role do usuário.
  rolesDefault = rolesENUM; // Enumeração das roles padrão.
  telasDefault: any = null; // Variável para armazenar as telas padrão.

  // Método para gerar as permissões do usuário.
  async generatePermission() {
    this.roleId = await this.tokenJwtService.getIdRole(); // Obtém o ID da role do usuário.
    this.telasDefault = this.telaService.telasAll; // Obtém todas as telas.

    // Se o usuário for administrador, verifica e retorna permissões administrativas.
    if (this.roleId == this.rolesDefault.ID_ADMIN) {
      this.verifyPermissions();
      return this.telaService.telaAdmin;
    } else {
      // Para outros usuários, verifica as permissões e as retorna.
      try {
        const res = await firstValueFrom(this.permissionsVariables$);
        this.verifyPermissions();
        return res;
      } catch (error: any) {
        console.error(error);
      }
    }

    return null; // Retorna nulo se nenhuma permissão for encontrada.
  }
}
