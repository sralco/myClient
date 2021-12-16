import { Component, OnInit, ViewChild } from '@angular/core';
import { Salone } from 'src/app/Models/Salone';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { Produzione } from 'src/app/Models/produzione';
import { Incasso } from 'src/app/Models/incasso';
import { MatSidenav } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { Intervallo } from 'src/app/Models/Intervallo';

@Component({
  selector: 'app-incasso',
  templateUrl: './incasso.component.html',
  styleUrls: ['./incasso.component.scss']
})
export class IncassoComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  salone: Salone;

  Intervalli: any;
  anno1: number;
  anno2: number;

  title = '';

  intervallo: Intervallo;
  temps: Incasso;

  attesa: boolean = true;

  constructor(private router: Router, private saloneService: SaloniService, private loc: Location, private notifier: NotifierService) { }

  ngOnInit() {

    this.temps = new Incasso;

    this.salone = this.saloneService.saloneCorrente;
    this.intervallo = JSON.parse(localStorage.getItem('Intervallo'));
    this.anno1 = Number.parseInt(this.intervallo.data2.substr(this.intervallo.data2.length - 4));
    this.anno2 = this.anno1 - 1;

    if (this.salone) {
    } else {
      this.salone = JSON.parse(localStorage.getItem("SaloneCorrente"));
    }

    this.aggiornaIncasso();
  }

  aggiornaIncasso() {
    this.saloneService.getIncasso(this.salone, this.intervallo.data1, this.intervallo.data2).subscribe(
      x => {
        this.temps = x;
        this.attesa = false;
      }, (err=> {
        this.attesa = false;
        this.notifier.notify('warning', 'Errore nella connessione al server');
      })
    );
  }

  receiveMessage($event) {
    this.intervallo.data1=$event.data1;
    this.intervallo.data2=$event.data2;
    this.attesa=true;
    this.aggiornaIncasso();
  }


  back() {
    this.loc.back();
  }


}
