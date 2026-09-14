export class EstabelecimentoInput {
    nome: string;
    logradouro: string;
    bairro: string;
    numero: string;
    cep: string;
    telefone: string;
    cnpj: string;
    gerente: string;
    proprietario: string;

    constructor(data: {
        nome: string;
        logradouro: string;
        bairro: string;
        numero: string;
        cep: string;
        telefone: string;
        cnpj: string;
        gerente: string;
        proprietario: string;
    }) {
        this.nome = data.nome;
        this.logradouro = data.logradouro;
        this.bairro = data.bairro;
        this.numero = data.numero;
        this.cep = data.cep;
        this.telefone = data.telefone;
        this.cnpj = data.cnpj;
        this.gerente = data.gerente;
        this.proprietario = data.proprietario;
    }
}