import { Routes } from '@angular/router';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { LoginComponent } from 'src/app/features/cms/page-login/login/login.component';
import { AuthGuardService } from 'src/app/guards/auth-guard.service';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    component: SidebarComponent,
    children: [
      {
        path: 'estabelecimento',
        loadChildren: () =>
          import('../estabelecimento/estabelecimento.module').then(
            (m) => m.EstabelecimentosModulo
          ),
        canActivate: [AuthGuardService],
      },
    ],
  },
];