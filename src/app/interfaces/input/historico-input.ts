export class HistoricoInput {
    data: string;
    preco: number;
    estabelecimentoId: number;

    constructor(data: {
        data: string;
        preco: number;
        estabelecimentoId: number;
    }) {
        this.data = data.data;
        this.preco = data.preco;
        this.estabelecimentoId = data.estabelecimentoId;
    }
}