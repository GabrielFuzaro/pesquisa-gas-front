export class TelaInput {
  identificador: string;
  descricao: string;
  unica: boolean | string;
  route: string;
  menu: number;
  visible: boolean | string;
  icon: string;

  constructor(tela: any) {
    this.identificador = tela.identificador;
    this.descricao = tela.descricao;
    this.unica = tela.unica;
    this.route = tela.route;
    this.menu = tela.menu;
    this.visible = tela.visible;
    this.icon = tela.icon;
  }
}
