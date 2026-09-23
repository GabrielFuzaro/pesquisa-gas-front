export class HistoricoInput {
    data: string;
    preco: number;
    estabelecimentoId: number;
    tamanhoId: number;

    constructor(data: {
        data: string;
        preco: number;
        estabelecimentoId: number;
        tamanhoId: number;
    }) {
        this.data = data.data;
        this.preco = data.preco;
        this.estabelecimentoId = data.estabelecimentoId;
        this.tamanhoId = data.tamanhoId;
    }
}