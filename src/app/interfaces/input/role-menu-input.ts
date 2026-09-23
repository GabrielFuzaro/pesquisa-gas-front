export class RoleMenuInput {
  role: number;
  menu: number;

  constructor(roleMenu: any) {
    this.role = roleMenu.role;
    this.menu = roleMenu.menu;
  }
}
