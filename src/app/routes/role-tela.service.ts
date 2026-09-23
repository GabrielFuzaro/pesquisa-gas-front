import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoleTela } from '../interfaces/dto/role-tela';
import { RoleTelaInput } from '../interfaces/input/role-tela-input';
import { CookieService } from '../services/cookie.service';
@Injectable({
  providedIn: 'root',
})
export class RoleTelaService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  urlRoleTela = `${environment.api}/role-tela`;

  HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

  });

  create(roleTelaInput: RoleTelaInput[]): Observable<RoleTela> {
    return this.http.post<RoleTela>(`${this.urlRoleTela}/`, roleTelaInput, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  delete(id: number): Observable<RoleTela> {
    return this.http.delete<RoleTela>(`${this.urlRoleTela}/${id}`, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  deleteByTela(idTela: number): Observable<RoleTela> {
    return this.http.delete<RoleTela>(`${this.urlRoleTela}/tela/${idTela}`, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  getById(id: number): Observable<RoleTela> {
    return this.http.get<RoleTela>(`${this.urlRoleTela}/` + id, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  getAll(): Observable<RoleTela[]> {
    return this.http.get<RoleTela[]>(`${this.urlRoleTela}`, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  getByRole(id: number): Observable<RoleTela[]> {
    return this.http.get<RoleTela[]>(`${this.urlRoleTela}/role/${id}`, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  getByTela(id: number): Observable<RoleTela[]> {
    return this.http.get<RoleTela[]>(`${this.urlRoleTela}/tela/${id}`, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  deleteByRole(id: number): Observable<RoleTela> {
    return this.http.delete<RoleTela>(
      `${this.urlRoleTela}/deletar-role-tela-por-id/${id}`,
      {
        headers: this.HttpHeaders,
      }
    ).pipe(take(1));
  }
}
