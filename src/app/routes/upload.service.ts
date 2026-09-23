import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from '../services/cookie.service';
@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

  });

  requestOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + this.cookieService.getCookie('token'),

    }),
    responseType: 'blob' as 'blob',
  };

  urlUpload = `${environment.api}/upload`;

  getDownload(nomeArquivo: string, caminho: string) {
    return this.http.post(
      `${this.urlUpload}/download-file/${nomeArquivo}/${caminho}`,
      null,
      this.requestOptions
    ).pipe(take(1));
  }
}
