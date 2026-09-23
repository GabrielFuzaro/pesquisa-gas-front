import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
})
export class DatepickerComponent {
  MONTH_NAMES = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  days: any = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  showDatepicker: boolean = false;
  datepickerValue: any = '';
  month: any = '';
  year: any = '';
  no_of_days: any = [];
  blankdays: any = [];

  @Input() textLabel?: string;
  @Output() dateChange: EventEmitter<string> = new EventEmitter();

  constructor(private utilsService: UtilsService) {}

  ngOnInit(): void {
    this.initDate();
  }

  initDate() {
    const today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
    // this.datepickerValue = new Date(
    //   this.year,
    //   this.month,
    //   today.getDate()
    // ).toDateString();
    // this.datepickerValue = this.utilsService.formatarData(this.datepickerValue);

    this.getNoOfDays();
  }

  isToday(date: any) {
    const today = new Date();
    const d = new Date(this.year, this.month, date);
    return today.toDateString() === d.toDateString() ? true : false;
  }

  getDateValue(date: any) {
    const selectedDate = new Date(this.year, this.month, date);

    this.datepickerValue = selectedDate.toDateString();
    this.datepickerValue = this.utilsService.formatarData(selectedDate);
    this.dateChange.emit(this.datepickerValue);

    this.showDatepicker = false;
  }

  getNoOfDays() {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

    // find where to start calendar day of week
    const dayOfWeek = new Date(this.year, this.month).getDay();
    const blankdaysArray = [];
    for (var i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
    }

    const daysArray = [];
    for (var i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    this.blankdays = blankdaysArray;
    this.no_of_days = daysArray;
  }
}
