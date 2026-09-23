import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { PermissionsGuardService } from 'src/app/guards/permissions-guard.service';
import { LoginService } from 'src/app/routes/login.service';
import { MenuDisplayService } from '../../routes/menu-display.service';
import { TokenJwtService } from '../../services/token-jwt.service';
import { NavItem } from './nav-item';

export const SCROLL_CONTAINER = 'mat-sidenav-content';
export const TEXT_LIMIT = 50;
export const SHADOW_LIMIT = 100;

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, AfterContentInit {
  idRole = 0;
  tipoPagina = 'CMS';
  isSidebarOpen: boolean = false;
  permissions: any = [];
  sideListOriginal: any;
  innerHTML = '';
  mobileQuery!: MediaQueryList;
  public isSmallScreen = false;
  menu!: NavItem[];
  menuOriginal!: NavItem[];

  constructor(
    private token: TokenJwtService,
    private loginService: LoginService,
    private permissionService: PermissionsGuardService,
    private breakpointObserver: BreakpointObserver,
    private menuDisplayService: MenuDisplayService
  ) { }

  async ngOnInit() {
    this.idRole = await this.token.getIdRole();

    this.permissions = await this.permissionService.generatePermission();

    this.menuDisplayService.getMenu(this.idRole).subscribe((res: NavItem[]) => {
      this.menu = res;

      const Cadastro = this.menu.find(
        item => item.identificador === 'cadastro'
      );


      const Estabelecimento: NavItem = {
        displayName: 'Estabelecimento',
        identificador: 'estabelecimento',
        iconName: 'report',
        route: '/cms/estabelecimento',
      };

      const Tamanho: NavItem = {
        displayName: 'Tamanho',
        identificador: 'tamanho',
        iconName: 'report',
        route: '/cms/tamanho',
      };

      const Historico: NavItem = {
        displayName: 'Histórico',
        identificador: 'historico',
        iconName: 'report',
        route: '/cms/historico',
      };

      if (Cadastro) {
        Cadastro.children ??= [];

        Cadastro.children.push(Estabelecimento);
        Cadastro.children.push(Tamanho);
        Cadastro.children.push(Historico);
      }

      ////////////////////////////

      // RELATÓRIO

      const Relatorios = this.menu.find(
        item => item.identificador === 'relatorios'
      );

      const Relatorio: NavItem = {
        displayName: 'Relatório',
        identificador: 'relatorio',
        iconName: 'report',
        route: '/cms/report',
      };

      if (Relatorios) {
        Relatorios.children ??= [];

        Relatorios.children.push(Relatorio);
      }



      this.menuOriginal = this.deepCopy(this.menu);
    });

    this.observerMenu();
  }

  ngAfterContentInit(): void {
    this.observerMenu();
  }

  observerMenu() {
    this.breakpointObserver
      .observe(['(max-width: 800px)'])
      .subscribe((res: any) => {
        this.isSmallScreen = res.matches;

        if (this.isSmallScreen) {
          document.querySelector('.sidebar')?.classList.remove('open');
          const logoDetails = document.getElementById('details');

          if (logoDetails) {
            logoDetails.style.display = 'none';
          }

          const displayName = document.getElementsByClassName('display-name');

          if (displayName) {
            for (let i = 0; i < displayName!.length; i++) {
              const name = displayName![i] as HTMLElement;
              name.style.display = 'none';
            }
          }
        } else {
          document.querySelector('.sidebar')?.classList.add('open');

          this.displayNameIconChange('flex');

          const logoDetails = document.getElementById('details');
          if (logoDetails) {
            logoDetails.style.display = 'block';
          }

          const displayName = document.getElementsByClassName('display-name');

          if (displayName) {
            for (let i = 0; i < displayName!.length; i++) {
              const name = displayName![i] as HTMLElement;
              name.style.display = 'block';
            }
          }
        }
      });
  }

  displayNameIconChange(style: string) {
    let displayIconList = document.querySelectorAll('.display-icon');
    displayIconList.forEach((element) => {
      element.setAttribute('style', `display: ${style};`);
    });

    let displayNameList = document.querySelectorAll('.display-name');
    displayNameList.forEach((element) => {
      element.setAttribute('style', `display: ${style};`);
    });
  }

  openMenu() {
    const sidebar = document.querySelector('.sidebar');
    const closeBtn = document.querySelector('#btn');
    sidebar!.classList.toggle('open');
    this.menuBtnChange(sidebar, closeBtn);

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 150);
  }

  menuBtnChange(
    sidebar: Element | null | undefined,
    closeBtn: Element | null | undefined
  ) {
    const displayName = document.getElementsByClassName('display-name');
    const displayIcon = document.getElementsByClassName('display-icon');
    const searchInput = document.getElementById('search-input');

    if (sidebar!.classList.contains('open')) {
      closeBtn!.classList.replace('bx-menu', 'bx-menu-alt-right');
      this.displayStyle(displayName, displayIcon, searchInput, 'flex');
      this.displayListChange('start');
    } else {
      closeBtn!.classList.replace('bx-menu-alt-right', 'bx-menu');
      this.displayStyle(displayName, displayIcon, searchInput, 'none');
      this.displayListChange('center');
    }
  }

  displayListChange(style: string) {
    let displayList = document.querySelectorAll('.display');
    displayList.forEach((element) => {
      element.setAttribute('style', `justify-content: ${style};`);
    });
  }


  private displayStyle(
    displayName: HTMLCollectionOf<Element>,
    displayIcon: HTMLCollectionOf<Element>,
    searchInput: HTMLElement | null,
    style: string
  ) {
    for (let i = 0; i < displayName!.length; i++) {
      const name = displayName![i] as HTMLElement;
      name.style.display = style;
    }

    for (let i = 0; i < displayIcon!.length; i++) {
      const icon = displayIcon![i] as HTMLElement;
      icon.style.display = style;
    }

    if (searchInput) {
      searchInput.style.display = style;
    }
  }

  applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim().toLowerCase();
    const findChildren: NavItem[] = [];
    let find: NavItem[] = [];

    if (filterValue === '' || filterValue == null || filterValue.length < 3) {
      this.resetMenu();
    } else {
      this.resetMenu();
      find = this.menu.filter((item: NavItem) => {
        const itemIdentificador = item.displayName.toLowerCase().replace(/_/g, ' ');
        return itemIdentificador.includes(filterValue);
      });

      if (find.length === 0) {
        this.resetMenu();

        this.menu.forEach((data) => {
          if (data.children && data.children.length !== 0) {
            data.children.forEach((res) => {
              const itemIdentificador = res.displayName.toLowerCase().replace(/_/g, ' ');

              if (itemIdentificador.includes(filterValue)) {
                if (!find.includes(data)) {
                  find.push(data);
                  findChildren.push(res);
                } else {
                  const existingParent = find.find((item) => item === data);
                  existingParent?.children?.push(res);
                }
              }
            });
          }
        });
      }

      if (find.length !== 0) {
        this.menu = find;
        // this.menu = find.map((item) => {
        //   return {
        //     ...item,
        //     children: item.children?.filter((child) =>
        //       findChildren.includes(child)
        //     )
        //   };
        // });
      } else {
        this.menu = [];
      }
    }
  }

  resetMenu() {
    this.menu = this.deepCopy(this.menuOriginal);
  }

  deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  async logout() {
    this.loginService.logout();
  }

  showMenu(flag: any) {
    const subMenus = document.getElementsByClassName(flag.identificador);
    const list = document.getElementById('list-' + flag.identificador);
    const icon = document.getElementById('icon-' + flag.identificador);
    const iconName = document.getElementById(flag.iconName);
    this.setStyleIconMenu(iconName);

    if (subMenus) {
      for (let i = 0; i < subMenus.length; i++) {
        const subMenu = subMenus[i] as HTMLElement;

        if (subMenu.classList.contains('block')) {
          subMenu.classList.replace('block', 'hidden');
          this.setStyleList(list, '10px', '#fafafa', '#000000');
          this.setStyleIcon(icon, 'keyboard_arrow_down');
        } else {
          subMenu.classList.replace('hidden', 'block');
          this.setStyleList(list, '0px', '#002069', '#fafafa');
          this.setStyleIcon(icon, 'keyboard_arrow_up');
          if (subMenu == subMenus[subMenus.length - 1]) {
            subMenu.style.marginBottom = '10px';
          }
        }
      }
    }
  }

  setStyleIconMenu(iconName: HTMLElement | null) {
    if (iconName) {
      if (iconName.classList.contains('icon')) {
        iconName.classList.replace('icon', 'icon-white');
      } else {
        iconName.classList.replace('icon-white', 'icon');
      }
    }
  }

  setStyleList(list: any, margin: string, backgroundColor: string, color: string) {
    if (list) {
      list.style.marginBottom = margin;
      list.style.backgroundColor = backgroundColor;
      list.style.color = color;
    }
  }

  setStyleIcon(icon: any, innerHTML: string) {
    if (icon) {
      icon.innerHTML = innerHTML;
    }
  }
}
