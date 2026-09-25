import { Routes } from '@angular/router';
import { CadastroEstabelecimentoComponent } from 'src/app/features/cms/estabelecimento/cadastro-estabelecimento/cadastro-estabelecimento.component';
import { EditEstabelecimentoComponent } from 'src/app/features/cms/estabelecimento/edit-estabelecimento/edit-estabelecimento.component';
import { InfoEstabelecimentoComponent } from 'src/app/features/cms/estabelecimento/info-estabelecimento/info-estabelecimento.component';
import { EstabelecimentoTableComponent } from 'src/app/features/cms/estabelecimento/estabelecimento-table/estabelecimento-table.component';
import { AuthGuardService } from 'src/app/guards/auth-guard.service';
import { RouteData } from 'src/app/interfaces/input/route-data';

export const EstabelecimentoRoutes: Routes = [
  {
    path: '',
    component: EstabelecimentoTableComponent,
    canActivate: [AuthGuardService],
    data: {
      routeIdentifier: 'estabelecimento'
    } as RouteData
  },
  {
    path: 'register',
    component: CadastroEstabelecimentoComponent,
    canActivate: [AuthGuardService],
    data: {
      routeIdentifier: 'estabelecimento'
    } as RouteData
  },
  {
    path: 'edit/:id',
    component: EditEstabelecimentoComponent,
    canActivate: [AuthGuardService],
    data: {
      routeIdentifier: 'estabelecimento'
    } as RouteData
  },
  {
    path: 'info/:id',
    component: InfoEstabelecimentoComponent,
    canActivate: [AuthGuardService],
    data: {
      routeIdentifier: 'estabelecimento'
    } as RouteData
  },

];