import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Estado } from '../interfaces/dto/estado';
import { Cidade } from '../interfaces/dto/cidade';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getStates(): Observable<Estado[]> {
    return this.http.get<Estado[]>(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
    ).pipe(take(1));
  }

  getCities(stateId: number): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios`
    ).pipe(take(1));
  }
}
