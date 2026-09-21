import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { EstabelecimentoInput } from "../interfaces/input/estabelecimento-input";
import { Observable } from "rxjs";
import { Estabelecimento } from "../interfaces/dto/estabelecimento";
import { environment } from "src/environments/environment";
import { CookieService } from "../services/cookie.service";

@Injectable({
    providedIn: 'root',
})
export class EstabelecimentoService {

    constructor(private http: HttpClient, private cookieService: CookieService) {}

    apiEst = `${environment.api}/estabelecimentos`

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 
            'Bearer ' +
            this.cookieService.getCookie('token'),
        })
    }

    createEstabelecimento(input: EstabelecimentoInput): Observable<Estabelecimento> {
        return this.http.post<Estabelecimento>(`${this.apiEst}`, input,
            {
                headers: this.getHeaders()
            }
        )
    }

    listarEstabelecimentos(): Observable<Estabelecimento[]>{
        return this.http.get<Estabelecimento[]>(`${this.apiEst}`, 
            {
                headers: this.getHeaders()
            }
        )
    }

    getById(id:number): Observable<Estabelecimento[]> {
        return this.http.get<Estabelecimento[]>(`${this.apiEst}/${id}`,
            {
                headers: this.getHeaders()
            }
        )
    }

    deleteEstabelecimento(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiEst}/${id}`,
            {
                headers: this.getHeaders()
            }
        )
    }

    updateEstabelecimtno(id: number, input: EstabelecimentoInput):Observable<Estabelecimento> {
        return this.http.put<Estabelecimento>(`${this.apiEst}/${id}`, input,
            {
                headers: this.getHeaders()
            }
        )
    }
}