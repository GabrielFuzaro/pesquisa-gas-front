import { DefaultDto } from './default-dto';
import { Role } from './role';

export interface User extends DefaultDto {
  name: string;
  email: string;
  password: string;
  idRole: number;
  role: string;

  // PARTE DE SOLICITANTE
  cpf: string;
  data_de_nascimento: string | Date;
  rua: string;
  bairro: string;
  cep: string;
  cidade: string;
  telefone: string;
  numero: string;
  complemento: string;
  estado: string;
  nacionalidade: string;
  naturalidade: string;
  filiacao_1: string;
  filiacao_2: string;
  rg: string;
  orgao: string;
  data_expedicao: string | Date;
  estado_expedicao: string;
  num_cnh: string;
  categoria_cnh: string;
}
