import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  public d;
  isDisabled = (date: NgbDate, current: {month: number}) =>  {
    this.d = new Date(date.year, date.month - 1, date.day);
    return this.d.getDay() === 0 ;
  }
  date: Date = new Date(); //year: 2020, month: 6, day: 25
  dia;
  mes;
  anio;
  today;

  model1;

  ngOnInit(){
    this.getToday();
  }

  getToday(){
    this.dia = this.date.getDate();
    this.mes = this.date.getMonth() + 1;
    this.anio = this.date.getFullYear();
    this.today = {year: this.anio, month: this.mes, day: this.dia};
    console.log(this.today);
  }
  displayMonths = 2;
  navigation = 'none';
  showWeekNumbers = false;
  outsideDays = 'visible';

}


