import { Component, OnInit, ViewChild } from '@angular/core';
import { Salone } from 'src/app/Models/Salone';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { GruppoServizi, Produzione } from 'src/app/Models/produzione';
import { MatSidenav } from '@angular/material/sidenav';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NotifierService } from 'angular-notifier';
import { Intervallo } from 'src/app/Models/Intervallo';

@Component({
  selector: 'app-produzione',
  templateUrl: './produzione.component.html',
  styleUrls: ['./produzione.component.scss']
})
export class ProduzioneComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  salone: Salone;

  Intervalli: any;
  anno1: number;
  anno2: number;

  title = '';

  intervallo: Intervallo;
  temps: Produzione;
  totalePassaggi: number;
  dettagli: GruppoServizi[]=[];

  attesa: boolean = true;

  constructor(private router: Router, private saloneService: SaloniService, private loc: Location, private notifier: NotifierService) {
    this.temps = new Produzione;
  }

  ngOnInit() {
    this.salone = this.saloneService.saloneCorrente;
    this.intervallo = JSON.parse(localStorage.getItem('Intervallo'));
    this.anno1 = Number.parseInt(this.intervallo.data2.substr(this.intervallo.data2.length - 4));
    this.anno2 = this.anno1 - 1;

    if (this.salone) {
    } else {
      this.salone = JSON.parse(localStorage.getItem("SaloneCorrente"));
    }

    this.aggiornaProduzione();
  }

  aggiornaProduzione() {
    this.saloneService.getProduzione(this.salone, this.intervallo.data1, this.intervallo.data2).subscribe(
      x => {
        this.temps = x;
        this.attesa = false;
        this.totalePassaggi = 0;

        this.saloneService.getDettagliProduzione(this.salone,this.intervallo.data1, this.intervallo.data2).subscribe(
          y => {this.dettagli = y;})
      }, (err => {
        this.attesa = false;
        this.notifier.notify('warning', 'Errore nella connessione al server');
      })
    );
  }
  totServizi:number = 0;
  totQta:number = 0;
  filtraArray(tipo: string): GruppoServizi[] {
    let ts:number = 0;
    let tq:number = 0;
    this.dettagli.filter(x => x.tipo === tipo).forEach(cc =>{
       ts = ts + cc.totale;
       tq = tq + cc.numero;
    });
    this.totServizi = ts;
    this.totQta = tq;

    return this.dettagli.filter(x => x.tipo === tipo)
  }

  receiveMessage($event) {
    this.intervallo.data1=$event.data1;
    this.intervallo.data2=$event.data2;
    this.attesa=true;
    this.aggiornaProduzione();
  }

  back() {
    this.loc.back();
  }

}
