import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ButtonPrimaryComponent } from '../components/button-primary/button-primary.component';
import { ButtonSecundaryComponent } from '../components/button-secundary/button-secundary.component';
import { DatepickerComponent } from '../components/datepicker/datepicker.component';
import { DialogComponent } from '../components/dialog/dialog.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SidebarUserComponent } from '../components/sidebar-user/sidebar-user.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatDialogModule,
  ],
  declarations: [
    SidebarComponent,
    SidebarUserComponent,
    DialogComponent,
    FooterComponent,
    SpinnerComponent,
    ButtonPrimaryComponent,
    NavbarComponent,
    ButtonSecundaryComponent,
    DatepickerComponent,
    BreadcrumbComponent,
  ],
  exports: [
    SidebarComponent,
    SidebarUserComponent,
    DialogComponent,
    ButtonPrimaryComponent,
    ButtonSecundaryComponent,
    BreadcrumbComponent,
    DatepickerComponent,
    FooterComponent,
    NavbarComponent,
    SpinnerComponent,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatDialogModule,
  ],
  providers: [],
})
export class SharedModule {}