import { DefaultDto } from './default-dto';

export interface Menu extends DefaultDto {
  identificador: string;
  nome_menu: string;
  icon: string;
  route: string;
  visible: boolean | string;
}
