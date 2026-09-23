import { Injectable } from '@angular/core';
import { LoginService } from 'src/app/routes/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from '../interfaces/dto/token';
import { Claims } from '../interfaces/dto/claims';
import { CookieService } from '../services/cookie.service';
@Injectable({
  providedIn: 'root',
})
export class TokenJwtService {
  tokenLogado!: Claims;

  constructor(
    private loginService: LoginService,
    private cookieService: CookieService
  ) {}

  setToken(login: Token) {
    this.cookieService.setCookie('token', login.token);
    this.cookieService.setCookie('email', login.email);
  }

  getToken() {
    return this.cookieService.getCookie('token');
  }

  getRole(): Promise<string> {
    this.tokenLogado = this.getClaimsToken(String(this.getToken()));
    return new Promise((resolve) => {
      if (this.tokenLogado) {
        resolve(this.tokenLogado.role);
      }
    });
  }

  getIdRole(): Promise<number> {
    this.tokenLogado = this.getClaimsToken(String(this.getToken()));
    return new Promise((resolve) => {
      if (this.tokenLogado) {
        resolve(this.tokenLogado.idRole);
      }
    });
  }

  getIdUser(): Promise<number> {
    this.tokenLogado = this.getClaimsToken(String(this.getToken()));
    return new Promise((resolve) => {
      if (this.tokenLogado) {
        resolve(this.tokenLogado.id);
      }
    });
  }

  getDecodedAccessToken(token: string): Token {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken;
  }

  getClaimsToken(token: string): Claims {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken;
  }

  isTokenExpired(token: string): boolean {
    const helper = new JwtHelperService();
    return helper.isTokenExpired(token);
  }
}
