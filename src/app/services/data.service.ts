import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CategoriasCnhResponse
  
} from '../interfaces/dto/data';
import { CookieService } from '../services/cookie.service';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private cnhUrl = 'assets/categorias_cnh.json';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getCategoriasCNH(): Observable<CategoriasCnhResponse> {
    return this.http.get<CategoriasCnhResponse>(this.cnhUrl);
  }

}
