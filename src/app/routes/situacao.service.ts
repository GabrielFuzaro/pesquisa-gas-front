import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Situacao } from '../interfaces/dto/situacao';
import { CookieService } from '../services/cookie.service';
@Injectable({
  providedIn: 'root',
})
export class SituacaoService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

  });


  getById(id: number): Observable<Situacao> {
    return this.http.get<Situacao>(`${environment.api}/situacao/` + id, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }

  getAll(): Observable<Situacao> {
    return this.http.get<Situacao>(`${environment.api}/situacao`, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }
}
