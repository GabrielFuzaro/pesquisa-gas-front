export class RoleTelaInput {
   tela: number
   role: number

  constructor(roleTela: any) {
    this.tela = roleTela.tela;
    this.role = roleTela.edital;
  }
}
