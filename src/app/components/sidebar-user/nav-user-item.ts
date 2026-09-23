export interface NavUserItem {
  displayName: string;
  disabled?: boolean;
  identificador: string;
  iconName: string;
  route?: string;
  children?: NavUserItem[];
}


