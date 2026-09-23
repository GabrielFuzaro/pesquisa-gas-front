export class TamanhoBotijaoInput {
    codigo: string;
    descricao: string;

    constructor(data: {
        codigo: string;
        descricao: string;
    }) {
        this.codigo = data.codigo;
        this.descricao = data.descricao;
    }
}
