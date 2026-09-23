export class MenuInput {
  identificador: string
  nome_menu: string
  icon: string
  route: string;

  constructor(menu: any) {
    this.identificador = menu.identificador;
    this.nome_menu = menu.nome_menu;
    this.icon = menu.icon;
    this.route = menu.route
  }
}
