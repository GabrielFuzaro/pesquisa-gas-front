import { DefaultDto } from "./default-dto";

export interface InformacoesHistorico extends DefaultDto {
    data: Date;
    preco: number;
    estabelecimento: String;
    logradouro: String;
    bairro: String;
    numero: String;
    cep: String;
    estabelecimentoId: number;
    tamanhoCodigo: string;
    tamanhoDescricao: string;
}