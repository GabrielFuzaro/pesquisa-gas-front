import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Claims } from 'src/app/interfaces/dto/claims';
import { Token } from 'src/app/interfaces/dto/token';
import { LoginInput } from 'src/app/interfaces/input/login-input';
import { LoginService } from 'src/app/routes/login.service';
import { CookieService } from 'src/app/services/cookie.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { StyleService } from 'src/app/services/style.service';
import { TokenJwtService } from 'src/app/services/token-jwt.service';

@Component({
  selector: 'login-usuario',
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.css'],
})
export class LoginUsuarioComponent implements OnInit {
  value = 'Entrar';
  constructor(
    private loginService: LoginService,
    private tokenJwtService: TokenJwtService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private notifier: NotifierService,
    private cookieService: CookieService,
    public styleService: StyleService
  ) {}

  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    if (this.cookieService.getCookie('email') != null) {
      this.loginForm
        .get('email')
        ?.setValue(this.cookieService.getCookie('email'));
      this.cookieService.deleteCookie('email');
    }

    const portalunico = this.cookieService.getCookie('portalunico');

    const token = this.cookieService.getCookie('token');
    if (token != null) {
      if (!this.tokenJwtService.isTokenExpired(String(token))) {
        this.router.navigateByUrl('/user/main');
      }
    }

    this.openDialog();
  }

  openDialog() {
    // this.dialog.open(DialogPopupComponent, {
    //   width: '400px',
    //   data: {  },
    // });
  }

  login() {
    if (this.loginForm.valid) {
      const loginInput = new LoginInput(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      );
      this.loginService.login(loginInput).subscribe(
        (response: Token) => {
          this.tokenJwtService.setToken(response);
          this.loginService.obterClaims().subscribe(
            (claims: Claims) => {
              this.cookieService.setCookie('user', claims.name);
              this.notifier.showSucess('Login efetuado com sucesso!');
              this.router.navigateByUrl('/user/main');
            },
            (error: any) => {
              this.notifier.showError('Login ou senha incorretos!');
            }
          );
        },
        (error: any) => {
          this.notifier.showError('Login ou senha incorretos!');
        }
      );
    }
  }

  showPassword() {
    const input = document.querySelector('#password') as HTMLInputElement;
    input!.type = input!.type === 'text' ? 'password' : 'text';
  }
}
