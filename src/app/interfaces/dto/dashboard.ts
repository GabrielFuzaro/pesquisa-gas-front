import { DashboardPrecos } from './dashboard-precos';
import { DefaultDto } from './default-dto';

export interface Dashboard extends DefaultDto {
  qtdEstabelecimentos: number;
  dashboardMediaPrecos: DashboardPrecos[];
  dashboardMenorPreco: DashboardPrecos[];
  dashboardMaiorPreco: DashboardPrecos[];
}
