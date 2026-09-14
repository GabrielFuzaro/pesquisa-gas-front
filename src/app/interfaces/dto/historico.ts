import { DefaultDto } from "./default-dto";
import { InformacoesHistorico } from "./informacoes-historico";

export interface Historico extends DefaultDto {

    estabelecimentoId: number;
    estabelecimento: String;
    informacoes: InformacoesHistorico[];
}