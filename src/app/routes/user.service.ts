import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from '../services/cookie.service';
import { environment } from 'src/environments/environment';
import { UserInput } from '../interfaces/input/user-input';
import { LoginInput } from '../interfaces/input/login-input';
import { Observable, take } from 'rxjs';
import { User } from '../interfaces/dto/user'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

  });

  urlUser = `${environment.api}/user`;
  urlAuth = `${environment.api}/auth`;

  getById(id: number): Observable<User> {
    return this.http
      .get<User>(`${this.urlUser}/` + id, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  ativarConta(email: string) {
    return this.http
      .post(`${this.urlAuth}/ativar-conta/${email}`, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  findCpf(cpf: string): Observable<User> {
    return this.http
      .get<User>(`${this.urlUser}/cpf/${cpf}`, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  mudarSenha(login: LoginInput): Observable<User> {
    return this.http
      .post<User>(`${this.urlUser}/mudar-senha`, login, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  create(user: UserInput): Observable<User> {
    return this.http
      .post<User>(`${this.urlUser}`, user, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  createUser(user: UserInput): Observable<User> {
    return this.http
      .post<User>(`${this.urlUser}/user`, user, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  getProfile(id: number | undefined): Observable<User> {
    return this.http
      .get<User>(`${this.urlUser}/dados-perfil/${id}`, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  editProfile(user: UserInput, id: number | undefined): Observable<User> {
    return this.http
      .put<User>(`${this.urlUser}/editar-perfil/${id}`, user, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }


  recuperacaoDeSenha(email: string) {
    return this.http
      .post<User>(`${this.urlAuth}/recuperar-senha/${email}`, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  getAll(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.urlUser}`, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

 getAllInativo(): Observable<User> {
    return this.http
      .get<User>(`${this.urlUser}/desativado`, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  edit(user: UserInput, id: number | undefined): Observable<User> {
    return this.http
      .put<User>(`${this.urlUser}/${id}`, user, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  ativar(user: UserInput, id: number): Observable<User> {
    return this.http
      .put<User>(`${this.urlUser}/ativar/${id}`, user, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }

  delete(id: number) {
    return this.http
      .delete(`${this.urlUser}/${id}`, {
        headers: this.HttpHeaders,
      })
      .pipe(take(1));
  }
}
