import { Historico } from "./historico";

export interface HistoricoPorMes {
    mes: number;
    mesExtenso: string;
    ano: number;
    historicos: Historico[];
}