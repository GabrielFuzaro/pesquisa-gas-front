import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { LoginComponent } from 'src/app/features/cms/page-login/login/login.component';
import { RegisterComponent } from 'src/app/features/cms/page-login/register/register.component';
import { AuthenticationRoutes } from './authentication.routing';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(AuthenticationRoutes),
    ToastrModule.forRoot(),
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [
    provideNgxMask({ dropSpecialCharacters: false })
  ],
})
export class AuthenticationModule {}