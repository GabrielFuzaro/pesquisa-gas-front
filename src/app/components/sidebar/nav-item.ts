export interface NavItem {
  displayName: string;
  disabled?: boolean;
  identificador: string;
  iconName: string;
  route?: string;
  children?: NavItem[];
}
