import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProfilePermissionInput } from '../interfaces/input/profile-permission-input';
import { Observable, take } from 'rxjs';
import { ProfilePermission } from '../interfaces/dto/profile-permission';
import { CookieService } from '../services/cookie.service';
@Injectable({
  providedIn: 'root',
})
export class ProfilePermissionService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

  });

  urlProfilePermission = `${environment.api}/profile-permission`;

  create(
    profilePermissionInput: ProfilePermissionInput
  ): Observable<ProfilePermission> {
    return this.http.post<ProfilePermission>(
      `${this.urlProfilePermission}/`,
      profilePermissionInput,
      {
        headers: this.HttpHeaders,
      }
    ).pipe(take(1));
  }

  edit(
    profilePermissionInput: ProfilePermissionInput,
    id: number
  ): Observable<ProfilePermission> {
    return this.http.put<ProfilePermission>(
      `${this.urlProfilePermission}/${id}`,
      profilePermissionInput,
      {
        headers: this.HttpHeaders,
      }
    ).pipe(take(1));
  }

  delete(id: number): Observable<ProfilePermission> {
    return this.http.delete<ProfilePermission>(
      `${this.urlProfilePermission}/${id}`,
      {
        headers: this.HttpHeaders,
      }
    ).pipe(take(1));
  }

  getById(id: number): Observable<ProfilePermission> {
    return this.http.get<ProfilePermission>(
      `${this.urlProfilePermission}/` + id,
      {
        headers: this.HttpHeaders,
      }
    ).pipe(take(1));
  }

  getAll(): Observable<ProfilePermission[]> {
    return this.http.get<ProfilePermission[]>(`${this.urlProfilePermission}`, {
      headers: this.HttpHeaders,
    }).pipe(take(1));
  }
}
