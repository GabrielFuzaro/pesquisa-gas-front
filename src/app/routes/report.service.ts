import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from '../services/cookie.service';
import { FiltroRelatorioExcel } from '../interfaces/dto/report-historico';
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

  });

  requestOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

    }),
    responseType: 'blob' as 'blob',
  };

  apiUrl = `${environment.api}/report`;

  gerarExcelHistorico(ids: number[]) {
    return this.http.get(
      `${this.apiUrl}/historico/relatorio-de-mes/${ids}`,
      this.requestOptions
    );
  }

  imprimirExcel(
    filtros: FiltroRelatorioExcel
  ) {
    return this.http.post(
      `${this.apiUrl}/historico/gerar-excel`,
      filtros,
      {
        responseType: 'blob'
      }
    );
  }
}
