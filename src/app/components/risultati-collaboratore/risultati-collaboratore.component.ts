import { Component, OnInit, ViewChild } from '@angular/core';
import { Salone } from 'src/app/Models/Salone';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { GruppoServizi } from 'src/app/Models/produzione';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Intervallo } from 'src/app/Models/Intervallo';
import { Collaboratore } from 'src/app/Models/Collaboratore';
import { PopClientiComponent } from '../dettagli-collaboratori/pop-clienti/pop-clienti.component';
import { Cliente } from 'src/app/Models/Cliente';

export class appClass {
  c:Cliente[];
  Servizio: string;
  Collaboratore: string;
}

@Component({
  selector: 'app-risultati-collaboratore',
  templateUrl: './risultati-collaboratore.component.html',
  styleUrls: ['./risultati-collaboratore.component.scss']
})
export class RisultatiCollaboratoreComponent implements OnInit {
  salone: Salone;
  collaboratore: Collaboratore;

  title = '';

  intervallo: Intervallo;
  temps: GruppoServizi[];
  servizi: GruppoServizi[];
  prodotti: GruppoServizi[];
  totServizi: number = 0;
  totRivendita: number = 0;

  attesa: boolean = true;

  constructor(private saloneService: SaloniService,private loc: Location, private notifier: NotifierService,public dialog: MatDialog) {
    let cc: Collaboratore = new Collaboratore();
    const app = localStorage.getItem('collaboratoreCorrente');
    if (app) {
      cc = JSON.parse(app);
    }
    this.collaboratore = cc;

  }

  ngOnInit(): void {
    this.aggiornaDettagli();
  }

  aggiornaDettagli() {
    if (this.saloneService.collaboratoreCorrente) {
      const idColl = this.saloneService.collaboratoreCorrente;
      this.servizi = [];
      this.prodotti = [];
      this.totServizi = 0;
      this.totRivendita = 0;
      this.saloneService.getDettagliCollaboratori(this.salone, this.intervallo.data1, this.intervallo.data2, idColl.id).subscribe(
        x => {
          this.temps = x;
          if (this.temps) {
            this.temps.forEach(s => {
              if (s.tipo === 'Servizi') {
                this.servizi.push(s);
                this.totServizi = this.totServizi + s.totale;
              } else {
                this.prodotti.push(s);
                this.totRivendita = this.totRivendita + s.totale;
              }
            })
          }
          this.totRivendita = this.totRivendita
          this.attesa = false;
        }, (err => {
          this.attesa = false;
          this.notifier.notify('warning', 'Errore nella connessione al server');
        })
      );

    }
  }

  receiveMessage($event) {
    this.intervallo.data1=$event.data1;
    this.intervallo.data2=$event.data2;
    this.attesa=true;
    this.aggiornaDettagli();
  }

  clientiServiti(c:GruppoServizi) {
    this.saloneService.getClientiServiti(this.salone,this.collaboratore.id,c.id,this.intervallo.data1, this.intervallo.data2).subscribe(x=>{
      let app=new appClass();
      app.c=x;
      app.Collaboratore=this.collaboratore.nome + ' ' + this.collaboratore.cognome;
      app.Servizio=c.gruppo;
      const dialogRef = this.dialog.open(PopClientiComponent, {
        maxWidth: '100vw !important',
        maxHeight: '100vw !important',
        data: app
      });
    }, (err =>{
      this.attesa = false;
          this.notifier.notify('warning', 'Errore nella connessione al server');
    }));
  }

  back() {
    this.loc.back();
  }

}
