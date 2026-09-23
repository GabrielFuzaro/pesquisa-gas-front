import { DefaultDto } from './default-dto';

export interface Cep extends DefaultDto {
  abreviatura: string;
  bairro: string;
  cep: string;
  localidade: string;
  logradouro: string;
  nomeLogradouro: string;
  numeroLocalidade: number;
  tipoCEP: number;
  tipoLogradouro: string;
  uf: string;
}
