import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NavItem } from '../components/sidebar/nav-item';
import { CookieService } from '../services/cookie.service';
@Injectable({
  providedIn: 'root',
})
export class MenuDisplayService {
  constructor(private http: HttpClient,
private cookieService : CookieService) {}

  HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

  });

  getMenu(id: number): Observable<NavItem[]> {
    return this.http.get<NavItem[]>(`${environment.api}/menu-display/` + id, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }


  // getAll() {
  //   return this.http.get(`${environment.api}/tela`, {
  //     headers: this.HttpHeaders,
  //   });
  // }
}
