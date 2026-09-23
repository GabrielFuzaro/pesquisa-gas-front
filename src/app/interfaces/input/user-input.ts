export class UserInput {
  name: string;
  email: string;
  password: string;
  role: number;

  // PARTE DE SOLICITANTE
  cpf: string;
  data_de_nascimento: Date;
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
  data_expedicao: Date;
  estado_expedicao: string;
  num_cnh: string;
  categoria_cnh: string;

  constructor(user: any) {
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
    this.cpf = user.cpf;
    this.data_de_nascimento = user.data_de_nascimento;
    this.rua = user.rua;

    this.bairro = user.bairro;
    this.cep = user.cep;
    this.cidade = user.cidade;

    this.telefone = user.telefone;
    this.numero = user.numero;
    this.complemento = user.complemento;
    this.estado = user.estado;
    this.nacionalidade = user.nacionalidade;
    this.naturalidade = user.naturalidade;
    this.filiacao_1 = user.filiacao_1;
    this.filiacao_2 = user.filiacao_2;
    this.rg = user.rg;
    this.orgao = user.orgao;
    this.data_expedicao = user.data_expedicao;
    this.estado_expedicao = user.estado_expedicao;
    this.num_cnh = user.num_cnh;
    this.categoria_cnh = user.categoria_cnh;
  }
}
