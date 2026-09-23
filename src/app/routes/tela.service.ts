import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TelaInput } from '../interfaces/input/tela-input';
import { Tela } from '../interfaces/dto/tela';
import { CookieService } from '../services/cookie.service';
@Injectable({
  providedIn: 'root',
})
export class TelaService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

  });
  create(tela: TelaInput): Observable<Tela> {
    return this.http.post<Tela>(`${environment.api}/tela`, tela, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  getById(id: number): Observable<Tela> {
    return this.http.get<Tela>(`${environment.api}/tela/` + id, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  getByMenu(id: number): Observable<Tela[]> {
    return this.http.get<Tela[]>(`${environment.api}/tela/menu/` + id, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  getAll(): Observable<Tela[]> {
    return this.http.get<Tela[]>(`${environment.api}/tela`, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  delete(id: number): Observable<Tela> {
    return this.http.delete<Tela>(`${environment.api}/tela/${id}`, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  deleteByMenu(idMenu: number): Observable<Tela> {
    return this.http.delete<Tela>(`${environment.api}/tela/menu/${idMenu}`, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  edit(tela: TelaInput, id: number | undefined): Observable<Tela> {
    return this.http.put<Tela>(`${environment.api}/tela/${id}`, tela, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }
}
