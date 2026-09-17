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
    BuscarHistoricosFiltroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
