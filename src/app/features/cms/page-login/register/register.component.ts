import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/dto/user';
import { UserInput } from 'src/app/interfaces/input/user-input';
import { UserService } from 'src/app/routes/user.service';
import { CookieService } from 'src/app/services/cookie.service';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private cookieService: CookieService
  ) {}

  user!: User;
  registerForm!: FormGroup;
  @ViewChild('inputCep') inputCep!: ElementRef;

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      rua: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      role: [1, Validators.required],
    });
  }

  register() {
    if (
      this.registerForm.get('password')?.value !=
      this.registerForm.get('passwordConfirm')?.value
    ) {
      this.notifier.showError('As senhas não coincidem!');
    } else {
      if (this.registerForm.valid) {
        const userDTO = {
          name: this.registerForm.get('name')?.value,
          cpf: this.registerForm.get('cpf')?.value,
          email: this.registerForm.get('email')?.value,
          telefone: this.registerForm.get('telefone')?.value,
          cep: this.registerForm.get('cep')?.value,
          rua: this.registerForm.get('rua')?.value,
          cidade: this.registerForm.get('cidade')?.value,
          bairro: this.registerForm.get('bairro')?.value,
          password: this.registerForm.get('password')?.value,
          role: this.registerForm.get('role')?.value,
        };

        const userInput = new UserInput(userDTO);

        this.userService.create(userInput).subscribe(
          (data) => {
            this.notifier.showSucess('Usuário cadastrado com sucesso!');
            this.cookieService.setCookie('email', userDTO.email)
            this.router.navigateByUrl('/login-usuario/login');
          },
          (error) => {
            this.notifier.showError(error.error);
          }
        );
      } else {
        this.notifier.showError('Preencha todos os campos corretamente!');
      }
    }
  }

}
