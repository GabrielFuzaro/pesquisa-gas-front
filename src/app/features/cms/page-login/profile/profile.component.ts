import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/dto/user';
import { UserInput } from 'src/app/interfaces/input/user-input';
import { LoginService } from 'src/app/routes/login.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { TokenJwtService } from 'src/app/services/token-jwt.service';
import { UtilsService } from 'src/app/services/utils.service';
import {
  CategoriaCnh,
  CategoriasCnhResponse,
} from 'src/app/interfaces/dto/data';
import { DataService } from 'src/app/services/data.service';
import { CepService } from 'src/app/routes/cep.service';
import { Cep } from 'src/app/interfaces/dto/cep';
import { LocationService } from 'src/app/routes/location.service';
import { Estado } from 'src/app/interfaces/dto/estado';
import { UserService } from 'src/app/routes/user.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private token: TokenJwtService,
    private dataService: DataService,
    private locationService: LocationService,
    private cepService: CepService
  ) {}

  user?: User;
  idUser!: number;
  userForm!: FormGroup;
  isDisabled = true;
  maxDate!: string;
  @ViewChild('inputCep') inputCep!: ElementRef;
  @ViewChild('inputCpf') inputCpf!: ElementRef;

  Salvar = 'Salvar';
  async ngOnInit() {
    this.idUser = await this.token.getIdUser();

    const userPromise = firstValueFrom(this.userService.getProfile(this.idUser));

    const [user] = await Promise.all([
      userPromise,
    ]);

    this.user = user;
    this.user.name = this.utilsService.formatterString(this.user.name);
    this.user.created = this.utilsService.formatarData(this.user.created);
    this.user.updated = this.utilsService.formatarData(this.user.updated);

    this.createTable();

  }

  createTable() {
    this.userForm = this.formBuilder.group({
      id: [{ value: this.user?.id, disabled: this.isDisabled }],
      name: [
        { value: this.user?.name, disabled: this.isDisabled },
        Validators.required,
      ],
      email: [
        { value: this.user?.email, disabled: this.isDisabled },
        Validators.required,
      ],
      role: [
        { value: this.user?.role, disabled: this.isDisabled },
        Validators.required,
      ],
      created: [
        { value: this.user?.created, disabled: this.isDisabled },
        Validators.required,
      ],
      updated: [
        { value: this.user?.updated, disabled: this.isDisabled },
        Validators.required,
      ],
    });
  }

  async salvarEdit() {
    if (this.userForm.valid) {
      const userDTO = {
        name: this.userForm.get('name')?.value,
        email: this.userForm.get('email')?.value,
        role: this.user?.idRole
      };

      const userInput = new UserInput(userDTO);
      this.userService.editProfile(userInput, this.user!.id!).subscribe(
        async (data) => {
          document.querySelector('#botaoEdit')?.classList.remove('hidden');
          document.querySelector('#salvarEdit')?.classList.add('hidden');
          this.isDisabled = true;
          this.userForm.disable();

          this.loginService.logout();
          this.notifier.showSuccess('Usuário atualizado com sucesso!');
          this.loginService.logout();
        },
        (error) => {
          this.notifier.showError(error.error);
          return;
        }
      );
    } else {
      this.utilsService.showInvalidFields(this.userForm);
      // this.utilsService.getFormValidationErrors(this.userForm);
    }
  }

  editProfile() {


    document.querySelector('#botaoEdit')?.classList.add('hidden');
    document.querySelector('#salvarEdit')?.classList.remove('hidden');
    this.isDisabled = false;
    this.userForm.enable();

  }

}
