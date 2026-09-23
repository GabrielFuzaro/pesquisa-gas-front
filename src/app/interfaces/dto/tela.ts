import { DefaultDto } from './default-dto';

export interface Tela extends DefaultDto {
  identificador: string;
  descricao: string;
  unica: boolean | string;
  visible: boolean | string;
  icon: string;
  route: string;
  id_menu: number;
  nome_menu: string;
}
