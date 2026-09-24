import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastrModule } from 'ngx-toastr';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { HomeComponent } from './features/user/home/home.component';
import { TableHistoricoPrecosComponent } from './features/user/home/table-historico-precos/table-historico-precos.component';
import { HttpClientModule } from '@angular/common/http';
import { BuscarCompetenciasFiltroComponent } from './features/user/home/buscar-competencias-filtro/buscar-competencias-filtro.component';
import { BuscarEstabelecimentosFiltroComponent } from './features/user/home/buscar-estabelecimentos-filtro/buscar-estabelecimentos-filtro.component';
import { BuscarHistoricosFiltroComponent } from './features/user/home/buscar-historicos-filtro/buscar-historicos-filtro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MapComponent } from './features/user/home/map/map.component';
import { ExpiredTokenComponent } from './errors/expired-token/expired-token.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ButtonPrimaryComponent } from './components/button-primary/button-primary.component';    
import { PrivacidadeComponent } from './features/politica/privacidade/privacidade.component';
import { TermosDeUsoComponent } from './features/politica/termos-de-uso/termos-de-uso.component';
import { LoginUsuarioComponent } from './features/user/page-login-user/login-usuario/login-usuario.component';
import { RegisterUsuarioComponent } from './features/user/page-login-user/register-usuario/register-usuario.component';
import { EsqueciASenhaComponent } from './features/user/page-login-user/esqueci-a-senha/esqueci-a-senha.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MatIconModule } from '@angular/material/icon';
import { MudarSenhaComponent } from './features/user/mudar-senha/mudar-senha.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarUserComponent } from './components/sidebar-user/sidebar-user.component';
import { ChartLineComponent } from './components/chart-line/chart-line.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ButtonSecundaryComponent } from './components/button-secundary/button-secundary.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BuscarTamanhosFiltroComponent } from './features/user/home/buscar-tamanhos-filtro/buscar-tamanhos-filtro.component';
import { OrdemBuscaFiltroComponent } from './features/user/home/ordem-busca-filtro/ordem-busca-filtro.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    BreadcrumbComponent,
    HomeComponent,
    TableHistoricoPrecosComponent,
    BuscarCompetenciasFiltroComponent,
    BuscarEstabelecimentosFiltroComponent,
    BuscarHistoricosFiltroComponent,
    MapComponent,
    ExpiredTokenComponent,
    NotFoundComponent,
    ButtonPrimaryComponent,
    PrivacidadeComponent,
    TermosDeUsoComponent,
    EsqueciASenhaComponent,
    LoginUsuarioComponent,
    RegisterUsuarioComponent,
    SpinnerComponent,
    MudarSenhaComponent,
    SidebarComponent,
    SidebarUserComponent,
    ChartLineComponent,
    DatepickerComponent,
    DialogComponent,
    ButtonSecundaryComponent,
    BuscarTamanhosFiltroComponent,
    OrdemBuscaFiltroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    NgApexchartsModule,
    MatDialogModule
  ],
  providers: [
    provideAnimations(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
