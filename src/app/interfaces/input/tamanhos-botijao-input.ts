export class TamanhoBotijaoInput {
    tamanhoBotijao: string;

    constructor(data: {
        tamanhoBotijao: string;
    }) {
        this.tamanhoBotijao =
            data.tamanhoBotijao;
    }
}