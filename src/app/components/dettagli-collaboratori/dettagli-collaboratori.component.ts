import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Salone } from 'src/app/Models/Salone';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Router} from '@angular/router';
import { Location } from '@angular/common';
import { GruppoServizi } from 'src/app/Models/produzione';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Intervallo } from 'src/app/Models/Intervallo';
import { Collaboratore } from 'src/app/Models/Collaboratore';
import { PopClientiComponent } from './pop-clienti/pop-clienti.component';
import { Cliente } from 'src/app/Models/Cliente';
import { viewClassName } from '@angular/compiler';

export class appClass {
  c: Cliente[];
  Servizio: string;
  Collaboratore: string;
}
@Component({
  selector: 'app-dettagli-collaboratori',
  templateUrl: './dettagli-collaboratori.component.html',
  styleUrls: ['./dettagli-collaboratori.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class DettagliCollaboratoriComponent implements OnInit {

  salone: Salone;
  collaboratore: Collaboratore;

  title = '';

  intervallo: Intervallo;
  temps: GruppoServizi[];
  servizi: GruppoServizi[];
  prodotti: GruppoServizi[];
  totServizi: number = 0;
  totRivendita: number = 0;
  totQta:number = 0;
  totIncasso: number = 0;
  totQtaProdotti: number = 0;
  totIncassoProdotti: number = 0;

  attesa: boolean = true;

  constructor(private router: Router, private saloneService: SaloniService, private loc: Location, private notifier: NotifierService, public dialog: MatDialog) {

   }

  ngOnInit() {
    this.salone = this.saloneService.saloneCorrente;
    this.collaboratore = this.saloneService.collaboratoreCorrente;
    if (!this.collaboratore) {
      this.collaboratore = JSON.parse(localStorage.getItem('collaboratorePredefinito'));
    }
    this.intervallo = JSON.parse(localStorage.getItem('Intervallo'));

    if (this.salone) {
    } else {
      this.salone = JSON.parse(localStorage.getItem("SaloneCorrente"));
    }
    this.aggiornaDettagli()
  }

  aggiornaDettagli() {
    if (this.saloneService.collaboratoreCorrente) {
      const idColl = this.saloneService.collaboratoreCorrente;
      this.servizi = [];
      this.prodotti = [];
      this.totServizi = 0;
      this.totRivendita = 0;

      const api = localStorage.getItem('BaseAppURL');
      if (api) {
        this.salone.destinazione = 'PC';
      }
      this.saloneService.getDettagliCollaboratori(this.salone, this.intervallo.data1, this.intervallo.data2, idColl.id).subscribe(
        x => {
          this.attesa = false;
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
        }, (err => {

          if (this.salone.destinazione = 'PC'){
            this.salone.destinazione='web';
          }else{
            this.salone.destinazione = 'PC';
          }

          this.saloneService.getDettagliCollaboratori(this.salone, this.intervallo.data1, this.intervallo.data2, idColl.id).subscribe(
            x => {
              this.attesa = false;
              this.temps = x;
              if (this.temps) {
                this.temps.forEach(s => {
                  if (s.tipo === 'Servizi') {
                    this.servizi.push(s);
                    this.totQta = this.totQta + s.numero;
                    this.totIncasso = this.totIncasso + s.totale;
                  } else {
                    this.prodotti.push(s);
                    this.totQtaProdotti = this.totQtaProdotti + s.numero;
                    this.totIncassoProdotti = this.totIncassoProdotti + s.totale;
                  }
                })
              }
              //this.totRivendita = this.totRivendita
              console.log(this.totRivendita)
            }, (err => {

              this.attesa = false;
              this.notifier.notify('warning', 'Errore nella connessione al server');
            })
          );

        })
      );

    }
    
  }

  receiveMessage($event) {
    this.intervallo.data1 = $event.data1;
    this.intervallo.data2 = $event.data2;
    this.attesa = true;
    this.aggiornaDettagli();
  }

  clientiServiti(c: GruppoServizi) {
    this.saloneService.getClientiServiti(this.salone, this.collaboratore.id, c.id, this.intervallo.data1, this.intervallo.data2).subscribe(x => {
      let app = new appClass();
      app.c = x;
      app.Collaboratore = this.collaboratore.nome + ' ' + this.collaboratore.cognome;
      app.Servizio = c.gruppo;
      const dialogRef = this.dialog.open(PopClientiComponent, {
        width:'95%',
        maxWidth: '350px',
        data: app
      });
    }, (err => {
      this.attesa = false;
      this.notifier.notify('warning', 'Errore nella connessione al server');
    }));
  }

  back() {
    this.loc.back();
  }

}
