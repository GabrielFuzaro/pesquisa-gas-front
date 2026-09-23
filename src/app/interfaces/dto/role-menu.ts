import { DefaultDto } from './default-dto';

export interface RoleMenu extends DefaultDto {
  id_role: number;
  role: string;
  id_menu: number;
  nome_menu: string;
}
