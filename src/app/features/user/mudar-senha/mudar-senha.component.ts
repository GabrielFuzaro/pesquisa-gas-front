import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/dto/user';
import { LoginInput } from 'src/app/interfaces/input/login-input';
import { UserService } from 'src/app/routes/user.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { TokenJwtService } from 'src/app/services/token-jwt.service';

@Component({
  selector: 'mudar-senha',
  templateUrl: './mudar-senha.component.html',
  styleUrls: ['./mudar-senha.component.css'],
})
export class MudarSenhaComponent implements OnInit {
  token = this.activatedRouter.snapshot.params['token'];
  loginForm!: FormGroup;
  email = '';
  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private activatedRouter: ActivatedRoute,
    private jwtService: TokenJwtService
  ) {}

  ngOnInit() {
    if (this.jwtService.isTokenExpired(this.token)) {
      this.router.navigateByUrl('/expired-token')
    } else {
      const token = this.jwtService.getDecodedAccessToken(this.token);
      this.email = token.email;
      this.loginForm = this.formBuilder.group({
        password: ['', Validators.required],
        passwordConfirm: ['', Validators.required],
      });
    }

  }

  submit() {
    if (this.loginForm.valid) {
      if (
        this.loginForm.get('password')?.value !=
        this.loginForm.get('passwordConfirm')?.value
      ) {
        this.notifier.showError('Senhas não conferem!');
        return;
      } else {
        const loginInput = new LoginInput(
          this.email,
          this.loginForm.get('password')?.value
        );

        this.userService.mudarSenha(loginInput).subscribe(
          (response: User) => {
            this.notifier.showSucess('Senha atualizada com sucesso!');
            this.router.navigate(['/login-usuario/login']);
          },
          (error: any) => {
            this.notifier.showError('Erro no sistema!');
          }
        );
      }
    }
  }
}
