import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {

  public currentRoute: string = '';

  constructor(private route: Router) {
    switch (this.route.url) {
      case '/home': this.currentRoute = 'Início';
      break;
      default: this.currentRoute = 'Página não encontrada';
    }
    this.valor = this.currentRoute;
  } 

  public valor: string;
  
}
