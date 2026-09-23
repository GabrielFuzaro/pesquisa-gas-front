import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Style } from '../interfaces/dto/style';
import { Observable } from 'rxjs';
import { CookieService } from '../services/cookie.service';
@Injectable({
  providedIn: 'root',
})
export class StyleService {
  colorVariables: { [key: string]: string } = {};

  urlApi = 'https://back-zof5fryata-uc.a.run.app';

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.getAll().subscribe((data: Style[]) => {
      data.forEach((element: Style) => {
        this.colorVariables[element.tipo] = element.cor;
      });
    });
  }

  getById(id: number): Observable<Style> {
    return this.http.get<Style>(`${this.urlApi}/cores/` + id);
  }

  getAll(): Observable<Style[]> {
    return this.http.get<Style[]>(`${this.urlApi}/cores`);
  }
}
