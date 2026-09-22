import { DefaultDto } from "./default-dto";

export interface Estabelecimento extends DefaultDto {
    id: number;
    nome: string;
    logradouro: string;
    bairro: string;
    numero: string;
    cep: string;
    telefone: string;
    cnpj: string;
    gerente: string;
    proprietario: string;
    latitude: string;
    longitude: string;
}