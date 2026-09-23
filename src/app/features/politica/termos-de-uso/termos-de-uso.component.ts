import { Component } from '@angular/core';

@Component({
  selector: 'termos-de-uso',
  templateUrl: './termos-de-uso.component.html',
  styleUrls: ['./termos-de-uso.component.css'],
})
export class TermosDeUsoComponent {
  return() {
    history.go(-1);
  }
}
