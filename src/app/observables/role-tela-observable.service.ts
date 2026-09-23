import { Injectable } from '@angular/core';

import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';

import { RoleTela } from '../interfaces/dto/role-tela';
import { RoleTelaService } from '../routes/role-tela.service';

@Injectable({
  providedIn: 'root'
})
export class RoleTelaObservableService {

  constructor(private roleTelaService: RoleTelaService) { }

  roleTela: RoleTela[] | null = null;
  private roleTelaSubject = new BehaviorSubject<RoleTela[] | null>(null);
  roleTela$: Observable<RoleTela[] | null> = this.roleTelaSubject.asObservable();

  async initRoleTela() {
    if (this.roleTelaSubject == null || this.roleTelaSubject.value == null) {
      try {
        const data = await firstValueFrom(this.roleTelaService.getAll());
        const roleTelaArray: RoleTela[] = data;
        this.roleTelaSubject.next(roleTelaArray);
        this.roleTela = roleTelaArray;
      } catch (error: any) {
        console.error(error);
      }
    }

  }

  getRoleTelaSnapshot() {
    return this.roleTelaSubject.value;
  }
}
