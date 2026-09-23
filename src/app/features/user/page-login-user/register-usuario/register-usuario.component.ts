import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { rolesENUM } from 'src/app/const/rolesENUM';
import { Cep } from 'src/app/interfaces/dto/cep';
import {
  CategoriaCnh,
  CategoriasCnhResponse,
} from 'src/app/interfaces/dto/data';
import { Estado } from 'src/app/interfaces/dto/estado';
import { User } from 'src/app/interfaces/dto/user';
import { UserInput } from 'src/app/interfaces/input/user-input';
import { CepService } from 'src/app/routes/cep.service';
import { LocationService } from 'src/app/routes/location.service';
import { UserService } from 'src/app/routes/user.service';
import { CookieService } from 'src/app/services/cookie.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'register-usuario',
  templateUrl: './register-usuario.component.html',
  styleUrls: ['./register-usuario.component.css'],
})
export class RegisterUsuarioComponent implements OnInit {
  value = 'Registrar';
  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private utilsService: UtilsService,
    private loadService: LoadingService,
    private cepService: CepService,
    private dataService: DataService,
    private locationService: LocationService,
    private cookieService: CookieService
  ) {}

  user!: User;

  estados: Estado[] = [];
  categoria_cnh: CategoriaCnh[] = [];
  registerForm!: FormGroup;
  maxDate!: string;
  role = rolesENUM.ID_CANDIDATO;
  @ViewChild('inputCep') inputCep!: ElementRef;
  @ViewChild('inputCpf') inputCpf!: ElementRef;

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      // PARTE 1
      name: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required]],
      data_de_nascimento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telefone: ['', [Validators.required]],

      // PARTE 2
      nacionalidade: ['', [Validators.required]],
      naturalidade: ['', [Validators.required]],
      filiacao_1: ['', [Validators.required]],
      filiacao_2: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      rua: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: ['', []],
      bairro: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],

      // PARTE 3
      rg: ['', [Validators.required]],
      orgao: ['', [Validators.required]],
      data_expedicao: ['', [Validators.required]],
      estado_expedicao: ['', [Validators.required]],
      num_cnh: ['', [Validators.required]],
      categoria_cnh: ['', [Validators.required]],
      valid: [false],

      // REQUIRED
      role: [this.role, Validators.required],
    });

    this.dataService
      .getCategoriasCNH()
      .subscribe((data: CategoriasCnhResponse) => {
        this.categoria_cnh = data.categories;
      });

    this.locationService.getStates().subscribe((data: Estado[]) => {
      this.estados = data;
    });

    this.maxDate = this.utilsService.formatDateToISO(new Date());
  }

  register() {
    if (!this.registerForm.get('valid')?.value) {
      this.notifier.showError('Você precisa aceitar os termos de uso');
    } else {
      this.verificarNome();

      this.verificarIdade();

      if (this.registerForm.valid) {
        const userDTO = this.createUserDto();
        const userInput = new UserInput(userDTO);
        this.loadService.show();
        this.userService.createUser(userInput).subscribe(
          (data) => {
            this.notifier.showSucess('Conta registrada com sucesso!');

            this.cookieService.setCookie('email', userDTO.email);
            this.loadService.hide();

            this.router.navigateByUrl('/login-usuario/login');
          },
          (error) => {
            this.loadService.hide();
            this.notifier.showError(error.error);
          }
        );
      } else {
        this.utilsService.showInvalidFields(this.registerForm);
      }
    }
  }

  private verificarIdade() {
    let dataNascimento = this.registerForm.get('data_de_nascimento')?.value;
    dataNascimento = moment(dataNascimento, 'DD/MM/YYYY');
    const years = moment().diff(dataNascimento, 'years');

    if (years < 16) {
      this.notifier.showError('Idade não permitida!');
      this.registerForm.get('data_de_nascimento')?.setValue('');
      this.utilsService.showInvalidFields(this.registerForm);
      return;
    }
  }

  private verificarNome() {
    const nome = this.registerForm.get('name')?.value;
    const nomeSplit = nome.trim().split(' ');
    if (nomeSplit.length < 2) {
      this.notifier.showError('Informe o nome completo!');
      this.registerForm.get('name')?.setValue('');
      this.utilsService.showInvalidFields(this.registerForm);
      return;
    }
  }

  private createUserDto() {
    return {
      name: this.utilsService.formatterString(
        this.registerForm.get('name')?.value
      ),
      cpf: this.registerForm.get('cpf')?.value,
      data_de_nascimento: this.utilsService.formatarDataToSQL(
        this.registerForm.get('data_de_nascimento')?.value
      ),
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      nacionalidade: this.registerForm.get('nacionalidade')?.value,
      naturalidade: this.registerForm.get('naturalidade')?.value,
      filiacao_1: this.registerForm.get('filiacao_1')?.value,
      filiacao_2: this.registerForm.get('filiacao_2')?.value,
      cep: this.registerForm.get('cep')?.value,
      rua: this.registerForm.get('rua')?.value,
      numero: this.registerForm.get('numero')?.value,
      complemento: this.registerForm.get('complemento')?.value,
      bairro: this.registerForm.get('bairro')?.value,
      cidade: this.registerForm.get('cidade')?.value,
      estado: this.registerForm.get('estado')?.value,
      telefone: this.registerForm.get('telefone')?.value,
      rg: this.registerForm.get('rg')?.value,
      orgao: this.registerForm.get('orgao')?.value,
      data_expedicao: this.utilsService.formatarDataToSQL(
        this.registerForm.get('data_expedicao')?.value
      ),
      estado_expedicao: this.registerForm.get('estado_expedicao')?.value,
      num_cnh: this.registerForm.get('num_cnh')?.value,
      categoria_cnh: this.registerForm.get('categoria_cnh')?.value,
      role: this.registerForm.get('role')?.value,
    };
  }

  findByCep() {
    let cep = this.registerForm.get('cep')?.value;
    if (cep == '' || cep == null) {
      this.notifier.showInfo('Informe um CEP');
    } else {
      if (
        (cep != null && cep != '') ||
        (this.registerForm.get('rua')?.value != null &&
          this.registerForm.get('rua')?.value != '')
      ) {
        cep = cep.replace('-', '');
        this.cepService.getCep(this.registerForm.get('cep')?.value).subscribe(
          (data: Cep) => {
            this.registerForm.get('rua')?.setValue(data.logradouro);
            this.registerForm.get('cidade')?.setValue(data.localidade);
            this.registerForm.get('bairro')?.setValue(data.bairro);
            this.registerForm.get('estado')?.setValue(data.uf);
          },
          (error) => {
            this.notifier.showError(error.error);
          }
        );
      }
    }
  }

  validarCPF() {
    let cpf = this.registerForm.get('cpf')?.value;

    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) {
      this.notifier.showInfo('CPF inválido');
      this.registerForm.get('cpf')?.setValue('');
      return false;
    }

    if (/^(\d)\1+$/.test(cpf)) {
      this.notifier.showInfo('CPF inválido');
      this.registerForm.get('cpf')?.setValue('');
      return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    const digitoVerificador1 = resto < 2 ? 0 : 11 - resto;

    if (parseInt(cpf.charAt(9)) !== digitoVerificador1) {
      this.notifier.showInfo('CPF inválido');
      this.registerForm.get('cpf')?.setValue('');
      return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    const digitoVerificador2 = resto < 2 ? 0 : 11 - resto;

    if (parseInt(cpf.charAt(10)) !== digitoVerificador2) {
      this.notifier.showInfo('CPF inválido');
      this.registerForm.get('cpf')?.setValue('');
      return false;
    }

    return true;
  }

  changeForm() {
    const activeLi = document.querySelector('li.activated');

    if (activeLi) {
      const activeLiId = activeLi.id;

      if (activeLiId === 'stepper-one') {
        this.switchForm('stepper-one', 'stepper-two', '#1C64F2', '#0E9F6E');
      } else if (activeLiId === 'stepper-two') {
        this.switchForm('stepper-two', 'stepper-three', '#1C64F2', '#0E9F6E');
      }
    } else {
      console.log('Nenhum elemento <li> ativo encontrado.');
    }
  }

  switchForm(
    currentFormId: string,
    nextFormId: string,
    nextFormColor: string,
    currentFormColor: string
  ) {
    document.getElementById(nextFormId)?.classList.add('activated');
    document.getElementById(currentFormId)?.classList.remove('activated');

    const nextForm = document.getElementById(nextFormId);
    const currentForm = document.getElementById(currentFormId);

    if (nextForm) {
      this.updateFormStyle(nextForm, nextFormColor);
    }

    if (currentForm) {
      this.updateFormStyle(currentForm, currentFormColor);
    }
  }

  updateFormStyle(formElement: HTMLElement, color: string) {
    formElement.style.color = color;
    const icon = formElement.querySelector('mat-icon') as HTMLElement;
    if (icon) {
      icon.style.color = color;
    }
  }

  nextForm(currentForm: string, next: boolean) {
    const form = document.getElementById(currentForm);

    if (form!.id === 'form-one') {
      this.findForm(form, 'form-two');
    } else if (form!.id === 'form-two') {
      if (next) {
        this.findForm(form, 'form-three');
      } else {
        this.findForm(form, 'form-one');
      }
    } else if (form!.id === 'form-three') {
      if (next) {
        this.register();
      } else {
        this.findForm(form, 'form-two');
      }
    }
  }

  findForm(form: any, next: string) {
    const nextForm = document.getElementById(next);
    form!.style.display = 'none';
    nextForm!.style.display = 'block';
    this.changeForm();
  }

  // showInvalidFields() {
  //   const invalidFields = [];
  //   const validFields = [];
  //   const controls = this.registerForm.controls;
  //   for (const name in controls) {
  //     if (
  //       controls[name].invalid ||
  //       // controls[name].touched ||
  //       controls[name].errors?.['required']
  //     ) {
  //       invalidFields.push(name);
  //     } else {
  //       validFields.push(name);
  //     }
  //   }
  //   if (invalidFields.length > 0) {
  //     this.notifier.showError('Campos inválidos');
  //     console.log('Campos inválidos: ' + invalidFields.join(', '));
  //     this.highlightInvalidFields(invalidFields, validFields);
  //   } else {
  //     console.log('Todos os campos estão válidos');
  //   }
  // }

  // highlightInvalidFields(invalidFields: string[], validFields: string[]) {
  //   invalidFields.forEach((field) => {
  //     const inputElement = document.querySelector(
  //       `[formControlName="${field}"]`
  //     );
  //     const errorElement = document.getElementById(`${field}-message-error`);

  //     if (inputElement) {
  //       inputElement.classList.add('invalid-field');
  //     }

  //     if (errorElement) {
  //       errorElement.style.display = 'block';
  //     }
  //   });

  //   validFields.forEach((field) => {
  //     const inputElement = document.querySelector(
  //       `[formControlName="${field}"]`
  //     );
  //     const errorElement = document.getElementById(`${field}-message-error`);

  //     if (inputElement) {
  //       inputElement.classList.remove('invalid-field');
  //     }

  //     if (errorElement) {
  //       errorElement.style.display = 'none';
  //     }
  //   });
  // }

  returnLogin() {
    this.router.navigateByUrl('/login-usuario/login');
  }
}
