import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RoleInput } from '../interfaces/input/role-input';
import { Observable, take } from 'rxjs';
import { Role } from '../interfaces/dto/role';
import { CookieService } from '../services/cookie.service';
@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

  });

  urlRole = `${environment.api}/role`;

  create(roleInput: RoleInput): Observable<Role> {
    return this.http.post<Role>(`${this.urlRole}/`, roleInput, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  edit(roleInput: RoleInput, id: number): Observable<Role> {
    return this.http.put<Role>(`${this.urlRole}/${id}`, roleInput, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  delete(id: number): Observable<Role> {
    return this.http.delete<Role>(`${this.urlRole}/${id}`, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  getById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.urlRole}/` + id, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.urlRole}`, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }
}
