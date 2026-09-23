export interface CategoriaCnh {
  code: string;
  description: string;
}
export interface CategoriasCnhResponse {
  categories: CategoriaCnh[];
}

export interface Tamanho {
  code: string;
  description: string;
}

export interface TamanhoResponse {
  tamanhos: Tamanho[];
}
