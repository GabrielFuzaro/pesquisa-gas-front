import { DefaultDto } from './default-dto';

export interface QtdInfoSistema extends DefaultDto {
  qtdUser: number;
  qtdProcessos: number;
  qtdPermissoes: number;
}
