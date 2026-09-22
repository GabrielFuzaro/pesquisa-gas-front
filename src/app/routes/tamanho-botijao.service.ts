import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CookieService } from "../services/cookie.service";
import { TamanhoBotijao } from "../interfaces/dto/tamanho-botijao";

@Injectable({
    providedIn: 'root',
})
export class TamanhoBotijaoService {

    constructor(private http: HttpClient, private cookieService: CookieService) {}

    apiTamanho = `${environment.api}/tamanhos-botijao`

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization:
            'Bearer ' +
            this.cookieService.getCookie('token'),
        })
    }

    listarTamanhos(): Observable<TamanhoBotijao[]> {
        return this.http.get<TamanhoBotijao[]>(`${this.apiTamanho}`,
            {
                headers: this.getHeaders()
            }
        )
    }
}
