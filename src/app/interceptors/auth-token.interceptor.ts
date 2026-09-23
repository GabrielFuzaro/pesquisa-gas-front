import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { CookieService } from '../services/cookie.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.cookieService.getCookie('token');
    const isApiRequest = req.url.startsWith(environment.api);
    const isLoginRequest = req.url.includes('/auth/login');

    if (!token || !isApiRequest || isLoginRequest || req.headers.has('Authorization')) {
      return next.handle(req);
    }

    const authRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(authRequest);
  }
}
