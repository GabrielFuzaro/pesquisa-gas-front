import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { PermissionsGuardService } from 'src/app/guards/permissions-guard.service';
import { LoginService } from 'src/app/routes/login.service';
import { MenuDisplayService } from '../../routes/menu-display.service';
import { TokenJwtService } from '../../services/token-jwt.service';
import { NavUserItem } from './nav-user-item';

export const SCROLL_CONTAINER = 'mat-sidenav-content';
export const TEXT_LIMIT = 50;
export const SHADOW_LIMIT = 100;
@Component({
  selector: 'sidebar-user',
  templateUrl: './sidebar-user.component.html',
  styleUrls: ['./sidebar-user.component.css'],
})
export class SidebarUserComponent implements OnInit, AfterContentInit {
  idRole = 0;
  tipoPagina = 'CMS';
  isSidebarOpen: boolean = false;
  permissions: any = [];
  sideListOriginal: any;
  innerHTML = '';
  mobileQuery!: MediaQueryList;
  public isSmallScreen = false;
  menu!: NavUserItem[];
  menuOriginal!: NavUserItem[];

  constructor(
    private token: TokenJwtService,
    private loginService: LoginService,
    private permissionService: PermissionsGuardService,
    private breakpointObserver: BreakpointObserver,
    private menuDisplayService: MenuDisplayService
  ) {}

  async ngOnInit() {
    this.idRole = await this.token.getIdRole();

    this.permissions = await this.permissionService.generatePermission();

    const navItems: NavUserItem[] = [
      {
        displayName: 'Início',
        disabled: false,
        identificador: 'home',
        iconName: 'home',
        route: '/user/main',
        children: [],
      },
      {
        displayName: 'Minha conta',
        disabled: false,
        identificador: 'minha-conta',
        iconName: 'person',
        route: '/user/profile',
        children: [],
      },
      {
        displayName: 'Exemplo submenu',
        disabled: false,
        identificador: 'menu',
        iconName: 'manage',
        children: [
          {
            displayName: 'Tabela',
            identificador: 'table',
            iconName: 'table',
            route: '/user/table',
          },
        ],
      },
    ];

    this.menu = navItems;

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
    } else {
      closeBtn!.classList.replace('bx-menu-alt-right', 'bx-menu');

      this.displayStyle(displayName, displayIcon, searchInput, 'none');
    }
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

    searchInput!.style.display = 'block';
  }

  applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim().toLowerCase();
    const findChildren: NavUserItem[] = [];
    let find: NavUserItem[] = [];
    if (filterValue == '' || filterValue == null || filterValue.length < 3) {
      this.menu = this.menuOriginal;
    } else {
      find = this.menu.filter((item: NavUserItem) => {
        const itemIdentificador = item.identificador
          .toLowerCase()
          .replace(/_/g, ' ');
        return itemIdentificador.includes(filterValue);
      });

      if (find.length == 0) {
        this.menu = this.menuOriginal;

        this.menu.forEach((data) => {
          if (data.children && data.children.length !== 0) {
            data.children.forEach((res) => {
              const itemIdentificador = res.identificador
                .toLowerCase()
                .replace(/_/g, ' ');

              if (itemIdentificador.includes(filterValue)) {
                find.push(data);
                findChildren.push(res);
              }
            });
          }
        });
      }

      if (find.length != 0) {
        this.menu = find;
        if (findChildren.length != 0) {
          find.forEach((res) => {
            res.children = findChildren;
          });
        }
      } else {
        this.menu = [];
      }
    }
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
    if (iconName!.classList.contains('icon')) {
      iconName!.classList.replace('icon', 'icon-white');
    } else {
      iconName!.classList.replace('icon-white', 'icon');
    }
  }

  setStyleList(
    list: any,
    margin: string,
    backgroundColor: string,
    color: string
  ) {
    list!.style.marginBottom = margin;
    list!.style.backgroundColor = backgroundColor;
    list!.style.color = color;
  }

  setStyleIcon(icon: any, innerHTML: string) {
    icon!.innerHTML = innerHTML;
  }
}
