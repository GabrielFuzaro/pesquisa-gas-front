import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cep } from '../interfaces/dto/cep';
import { CookieService } from '../services/cookie.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CepService {
  constructor(private http: HttpClient) { }

  url = environment.apiCorreios;

  getCep(cep: string): Observable<Cep> {
    return this.http.get<Cep>(`${this.url}/cep/${cep}`);
  }
}
