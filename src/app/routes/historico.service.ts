import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HistoricoCompetencias } from "../interfaces/dto/historico-competencias";
import { CookieService } from "../services/cookie.service";
import { Observable } from 'rxjs';
import { Page } from "../interfaces/dto/page";
import { environment } from "src/environments/environment";
import { HistoricoPreco } from "../interfaces/dto/historico-preco";
import { Historico } from "../interfaces/dto/historico";
import { HistoricoPorMes } from "../interfaces/dto/historico-por-mes";

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

    buscarHistoricosPorMesEspecifico(mes: number, ano: number): Observable<Historico[]> {
    const params = new HttpParams()
        .set('mes', mes)
        .set('ano', ano);

    return this.http.get<Historico[]>(`${this.apiHist}/por-mes-especifico`, {
        headers: this.httpHeaders,
        params
    });
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

    buscarTodosHistoricos(): Observable<Page<Historico>> {
        return this.http.get<Page<Historico>>(`${this.apiHist}`, {
            headers: this.httpHeaders
        })
    }

    buscarMenorPrecoAtuais(
        page: number,
        size: number,
        orderPreco: string,
        mes: number,
        ano: number,
        estabelecimentoId?: number
        ): Observable<Page<HistoricoPorMes>> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('orderPreco', orderPreco)
            .set('mes', mes)
            .set('ano', ano);

        if (estabelecimentoId !== undefined) {
            params = params.set('estabelecimentoId', estabelecimentoId);
        }

        return this.http.get<Page<HistoricoPorMes>>(`${this.apiHist}/competencias-detalhadas`, {
            headers: this.httpHeaders,
            params
        });
        }
}