import { Component } from '@angular/core';

@Component({
  selector: 'privacidade',
  templateUrl: './privacidade.component.html',
  styleUrls: ['./privacidade.component.css'],
})
export class PrivacidadeComponent {
  return() {
    history.go(-1);
  }
}
