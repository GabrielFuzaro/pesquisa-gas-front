export type CampoFiltroMultiplo =
    | 'estabelecimentos'
    | 'tamanhos'
    | 'bairro';

export type DropdownFiltro =
    | 'estabelecimento'
    | 'tamanho'
    | 'bairro';

export interface ConfiguracaoFiltro {
    label: string;
    campo: CampoFiltroMultiplo;
    dropdown: DropdownFiltro;
    uppercase?: boolean;
}

export interface ColunaRelatorio {
    id: number;
    label: string;
    field: string;
}