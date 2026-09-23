import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/routes/user.service';
import { LoadingService } from 'src/app/services/loading.service';
import { NotifierService } from 'src/app/services/notifier.service';
@Component({
  selector: 'esqueci-a-senha',
  templateUrl: './esqueci-a-senha.component.html',
  styleUrls: ['./esqueci-a-senha.component.css'],
})
export class EsqueciASenhaComponent implements OnInit {
  value = 'Enviar';
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private loadService: LoadingService
  ) {}

  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  submit() {
    if (this.loginForm.valid) {
      this.loadService.show();
      this.userService.recuperacaoDeSenha(this.loginForm.value.email).subscribe(
        (response: any) => {
          this.loadService.hide();
          this.notifier.showSucess('Email enviado com sucesso!');
        },
        (error: any) => {
          this.loadService.hide();
          this.notifier.showError('Erro no sistema');
        }
      );
    }
  }
}
