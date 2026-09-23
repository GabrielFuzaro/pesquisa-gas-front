import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dashboard } from '../interfaces/dto/dashboard';
import { CookieService } from '../services/cookie.service';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient,
private cookieService : CookieService) {}

  HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

  });

  urlDashboard = `${environment.api}/dashboard`;

  getAll(
    dataInicial?: string | null, 
    dataFinal?: string | null,
  ): Observable<Dashboard> {
    const params: any = {};

    if (dataInicial) {
      params.dataInicial = dataInicial;
    }

    if (dataFinal) {
      params.dataFinal = dataFinal;
    }

    return this.http.get<Dashboard>(`${this.urlDashboard}`, {
      headers: this.HttpHeaders,
      params,
    }).pipe(take(1));
  }

  buscarGraficoPreco(dias: number){
    return this.http.get<any[]>(`${this.urlDashboard}/grafico?dias=${dias}`, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }
}
