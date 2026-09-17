import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HistoricoCompetencias } from "../interfaces/dto/historico-competencias";
import { CookieService } from "../services/cookie.service";
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { HistoricoPreco } from "../interfaces/dto/historico-preco";
import { Historico } from "../interfaces/dto/historico";

@Injectable({
    providedIn: 'root'
})
export class HistoricoService{

    constructor(private http: HttpClient, private cookieService: CookieService){}

    apiHist = `${environment.api}/historico`

    httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

  });

  buscarHistorico(): Observable<Historico[]> {
    return this.http.get<Historico[]>(`${this.apiHist}`,
        {
            headers: this.httpHeaders
        }
    )
  }

    buscarHistoricoCompetencias(): Observable<HistoricoCompetencias[]> {
        return this.http.get<HistoricoCompetencias[]>(`${this.apiHist}/competencias`,
            {
                headers: this.httpHeaders
            }
        )
    }

    buscarHistoricosATuais(): Observable<HistoricoPreco[]> {
        return this.http.get<HistoricoPreco[]>(`${this.apiHist}/atuais`,
            {
                headers: this.httpHeaders
            }
        );
    }
}