import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { SaloniService } from 'src/app/Services/saloni.service';

@Component({
  selector: 'app-onde',
  templateUrl: './onde.component.html',
  styleUrls: ['./onde.component.scss']
})
export class OndeComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  Intervalli: any;
  title: string;

  constructor(private service: SaloniService) { }

  ngOnInit() {
    this.title = localStorage.getItem('GruppoSaloni');

  }

  memorizzaDati(t: any) {
    localStorage.setItem("Data1", t.data1);
    localStorage.setItem("Data2", t.data2);
    localStorage.setItem("IntervalloCorrente", t.name);
    localStorage.setItem("CodiceIntervallo", t.codice);
  }


}
