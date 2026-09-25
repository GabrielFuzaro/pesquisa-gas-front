import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { rolesENUM } from 'src/app/const/rolesENUM';
import { PermissionsGuardService } from 'src/app/guards/permissions-guard.service';
import { Claims } from 'src/app/interfaces/dto/claims';
import { RoleTela } from 'src/app/interfaces/dto/role-tela';
import { Token } from 'src/app/interfaces/dto/token';
import { LoginInput } from 'src/app/interfaces/input/login-input';
import { LoginService } from 'src/app/routes/login.service';
import { RoleTelaService } from 'src/app/routes/role-tela.service';
import { CookieService } from 'src/app/services/cookie.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { StyleService } from 'src/app/services/style.service';
import { TokenJwtService } from 'src/app/services/token-jwt.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  value = 'Entrar';
  constructor(
    private loginService: LoginService,
    private tokenJwtService: TokenJwtService,
    private router: Router,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private permissionsGuardService: PermissionsGuardService,
    private roleTela: RoleTelaService,
    public styleService: StyleService,
    private cookieService: CookieService
  ) {}

  loginForm!: FormGroup;
  tipoPagina = 'USER';

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
  }

  login() {
    if (this.loginForm.valid) {
      const loginInput = new LoginInput(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      );
      this.loginService.login(loginInput).subscribe(
        (loginResponse: Token) => {
          this.tokenJwtService.setToken(loginResponse);
          let token = this.tokenJwtService.getClaimsToken(
            String(this.tokenJwtService.getToken())
          );

          this.cookieService.setCookie('user', token.name);
          this.permissionsGuardService.ngOnInit();
          this.notifier.showSucess('Login efetuado com sucesso!');

          if (token.role != rolesENUM.ROLE_ADMIN) {
            this.verifyRouteAcess(token);
          } else {
            this.router.navigate(['/cms/dashboard']);
          }
        },
        (error: any) => {
          this.notifier.showError('Login ou senha incorretos!');
        }
      );
    } else {
      this.notifier.showError('Preencha todos os campos!');
    }
  }

  showPassword() {
    const input = document.querySelector('#password') as HTMLInputElement;
    input!.type = input!.type === 'text' ? 'password' : 'text';
  }

  async verifyRouteAcess(claims: Claims) {
    await this.roleTela
      .getByRole(claims.idRole)
      .subscribe((responseRoleTela: RoleTela[]) => {
        responseRoleTela!.forEach((roleTela: RoleTela) => {
          if (roleTela.identificador == 'dashboard') {
            this.router.navigate(['/cms/dashboard']);
          }
        });
      });

    this.router.navigate(['/cms/profile']);
  }
}
