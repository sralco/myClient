import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/components/intervallo-data/format-datetimepicker';
import { Intervallo } from 'src/app/Models/Intervallo';

@Component({
  selector: 'app-intervallo-data',
  templateUrl: './intervallo-data.component.html',
  styleUrls: ['./intervallo-data.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class IntervalloDataComponent implements OnInit {
  /*   @ViewChild('dateCtrl1') matData1: MatDatepicker<Date>;
    @ViewChild('dateCtrl2') matData2: MatDatepicker<Date>;
   */
  @Input() data1: string;
  @Input() data2: string;

  @Output() messageEvent=new EventEmitter<Intervallo>();

  dData1: Date=new Date();
  dData2: Date=new Date();


  constructor() { }

  ngOnInit(): void {

    let app: string[]=this.data1.split('/');

    let anno = Number.parseInt(app[2]);
    let mese = Number.parseInt(app[1])-1;
    let giorno = Number.parseInt(app[0]);
    this.dData1=new Date(anno,mese,giorno);
    //console.log(this.data1 + ' ' + giorno + '/' + mese + '/' + anno);

    app=this.data2.split('/');

    anno = Number.parseInt(app[2]);
    mese = Number.parseInt(app[1])-1;
    giorno = Number.parseInt(app[0]);
    this.dData2=new Date(anno,mese,giorno);
    //console.log(this.data2 + ' ' + giorno + '/' + mese + '/' + anno);

  }

  sendMessage(){
    let dd:Intervallo=new Intervallo();

    let anno = this.dData1.getFullYear();
    let mese = this.dData1.getMonth()+1;
    let giorno = this.dData1.getDate();
    dd.data1=giorno + '/' + mese + '/'+ anno;

    anno = this.dData2.getFullYear();
    mese = this.dData2.getMonth()+1;
    giorno = this.dData2.getDate();
    dd.data2=giorno + '/' + mese + '/'+ anno;

    //console.log(JSON.stringify(dd));
    this.messageEvent.emit(dd);
  }
}
