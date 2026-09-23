import { DefaultDto } from './default-dto';
import { InformacoesHistorico } from './informacoes-historico';

export interface ReportHistorico extends DefaultDto {
  estabelecimentoId: number;
  estabelecimento: string;
  informacoes: InformacoesHistorico[];
}

export interface FiltroRelatorioExcel {
  ids: number[];
  estabelecimento?: string[];
  tamanhoBotijao?: string[];
  endereco?: string[];
  dataInicio?: string;
  dataFinal?: string;
  colunasOcultas: string[];
}