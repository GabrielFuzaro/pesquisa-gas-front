import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/routes/login.service';
import { CookieService } from 'src/app/services/cookie.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Input() value: string | undefined;

  nameUser: string | {[property: string]: string} | undefined;

  ngOnInit(): void {
    this.nameUser = this.cookieService.getCookie('user')
  }

  constructor(private cookieService: CookieService, private loginService: LoginService, private route: Router) {}

  async logout(user?: boolean) {
    this.loginService.logout(user)
  }
}
