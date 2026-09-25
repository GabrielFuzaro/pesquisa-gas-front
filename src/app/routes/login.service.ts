import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take } from 'rxjs';
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Token } from "../interfaces/dto/token";
import { LoginInput } from "../interfaces/input/login-input";
import { CookieService } from "../services/cookie.service";
import { NotifierService } from "../services/notifier.service";
import { Claims } from "../interfaces/dto/claims";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient, private router: Router, private cookieService: CookieService, private notificer: NotifierService){ }

    login(login: LoginInput): Observable<Token>{
        return this.http.post<Token>(`${environment.api}/auth/login`, login)
    }

    verifyToken() {
        return this.http.post(`${environment.api}/auth/verify-token`,this.cookieService.getCookie('token'))
        .pipe(take(1))
    }

    obterClaims(): Observable<Claims> {
        return this.http.post<Claims>(`${environment.api}/auth/obter-claims`, 
            this.cookieService.getCookie('token')
        )
    }

    isLogin(){
        this.verifyToken().subscribe(
            () => {},
            () => {
                this.notificer.showWarning('Sessão expirada, faça login novamente');
                this.logout()
            }
        )
    }

    logout(user?: boolean){
        this.cookieService.deleteCookie('token');
        this.cookieService.deleteCookie('email');

        if(user) {
            this.router.navigate(['/home']);
        } else {
            this.router.navigate(['/cms/login'])
        }
    }
}