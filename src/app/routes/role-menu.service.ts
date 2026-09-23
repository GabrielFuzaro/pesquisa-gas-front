import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RoleMenuInput } from '../interfaces/input/role-menu-input';
import { Observable, take } from 'rxjs';
import { RoleMenu } from '../interfaces/dto/role-menu';
import { CookieService } from '../services/cookie.service';
@Injectable({
  providedIn: 'root',
})
export class RoleMenuService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

  });

  urlRoleMenu = `${environment.api}/role-menu`;

  create(roleMenuInput: RoleMenuInput[]): Observable<RoleMenu> {
    return this.http
      .post<RoleMenu>(`${this.urlRoleMenu}/`, roleMenuInput, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  edit(roleMenuInput: RoleMenuInput, id: number): Observable<RoleMenu> {
    return this.http
      .put<RoleMenu>(`${this.urlRoleMenu}/${id}`, roleMenuInput, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  delete(id: number): Observable<RoleMenu> {
    return this.http
      .delete<RoleMenu>(`${this.urlRoleMenu}/${id}`, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  deleteByMenu(idMenu: number): Observable<RoleMenu> {
    return this.http
      .delete<RoleMenu>(`${this.urlRoleMenu}/menu/${idMenu}`, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  getById(id: number): Observable<RoleMenu> {
    return this.http
      .get<RoleMenu>(`${this.urlRoleMenu}/` + id, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  getByMenu(id: number): Observable<RoleMenu[]> {
    return this.http
      .get<RoleMenu[]>(`${this.urlRoleMenu}/menu/` + id, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  getAll(): Observable<RoleMenu> {
    return this.http
      .get<RoleMenu>(`${this.urlRoleMenu}`, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }
}
