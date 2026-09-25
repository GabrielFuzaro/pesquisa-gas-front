import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
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
import { PrivacidadeComponent } from './features/politica/privacidade/privacidade.component';
import { TermosDeUsoComponent } from './features/politica/termos-de-uso/termos-de-uso.component';
import { LoginUsuarioComponent } from './features/user/page-login-user/login-usuario/login-usuario.component';
import { RegisterUsuarioComponent } from './features/user/page-login-user/register-usuario/register-usuario.component';
import { EsqueciASenhaComponent } from './features/user/page-login-user/esqueci-a-senha/esqueci-a-senha.component';
import { MatIconModule } from '@angular/material/icon';
import { MudarSenhaComponent } from './features/user/mudar-senha/mudar-senha.component';
import { ChartLineComponent } from './components/chart-line/chart-line.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatDialogModule } from '@angular/material/dialog';
import { BuscarTamanhosFiltroComponent } from './features/user/home/buscar-tamanhos-filtro/buscar-tamanhos-filtro.component';
import { OrdemBuscaFiltroComponent } from './features/user/home/ordem-busca-filtro/ordem-busca-filtro.component';
import { SharedModule } from './modules/shared.module';
import { provideNgxMask } from 'ngx-mask';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TableHistoricoPrecosComponent,
    BuscarCompetenciasFiltroComponent,
    BuscarEstabelecimentosFiltroComponent,
    BuscarHistoricosFiltroComponent,
    MapComponent,
    ExpiredTokenComponent,
    NotFoundComponent,
    PrivacidadeComponent,
    TermosDeUsoComponent,
    EsqueciASenhaComponent,
    LoginUsuarioComponent,
    RegisterUsuarioComponent,
    MudarSenhaComponent,
    ChartLineComponent,
    BuscarTamanhosFiltroComponent,
    OrdemBuscaFiltroComponent,
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
    MatDialogModule,
    SharedModule,
  ],
  providers: [
    provideAnimations(),
    provideNgxMask({ dropSpecialCharacters: false })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }