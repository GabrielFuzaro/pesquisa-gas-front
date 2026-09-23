import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MenuInput } from '../interfaces/input/menu-input';
import { Observable, take } from 'rxjs';
import { Menu } from '../interfaces/dto/menu';
import { CookieService } from '../services/cookie.service';
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private http: HttpClient,
private cookieService : CookieService) {}

  HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

  });

  urlMenu = `${environment.api}/menu`;

  create(menuInput: MenuInput): Observable<Menu> {
    return this.http
      .post<Menu>(`${this.urlMenu}/`, menuInput, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  edit(menuInput: MenuInput, id: number): Observable<Menu> {
    return this.http
      .put<Menu>(`${this.urlMenu}/${id}`, menuInput, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  delete(id: number): Observable<Menu> {
    return this.http
      .delete<Menu>(`${this.urlMenu}/${id}`, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  getById(id: number): Observable<Menu> {
    return this.http
      .get<Menu>(`${this.urlMenu}/` + id, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  getAll(): Observable<Menu[]> {
    return this.http
      .get<Menu[]>(`${this.urlMenu}`, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }
}
