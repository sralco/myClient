import { Component, OnInit, ViewChild } from '@angular/core';
import { Salone } from 'src/app/Models/Salone';
import { SaloniService } from 'src/app/Services/saloni.service';
import { CollaboratoriService } from 'src/app/Services/collaboratori.service';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { Cliente } from 'src/app/Models/Cliente';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { Intervallo } from 'src/app/Models/Intervallo';
import { TempFiche } from 'src/app/Models/Temp-Fiche';
import { PopFicheComponent } from './pop-fiche/pop-fiche.component';

@Component({
  selector: 'app-passaggi',
  templateUrl: './passaggi.component.html',
  styleUrls: ['./passaggi.component.scss']
})
export class PassaggiComponent implements OnInit {
  pageOfItems: Array<any>;

  salone: Salone;

  Intervalli: any;

  title = '';

  intervallo: Intervallo;
  temps: Cliente[];
  totalePassaggi: number;

  attesa: boolean = true;

  constructor(private router: Router, private saloneService: SaloniService, private loc: Location, private notifier: NotifierService, public dialog: MatDialog) { }

  ngOnInit() {
    this.salone = this.saloneService.saloneCorrente;
    this.intervallo = JSON.parse(localStorage.getItem('Intervallo'));

    if (this.salone) {
    } else {
      this.salone = JSON.parse(localStorage.getItem("SaloneCorrente"));
    }

    this.aggiornaPassaggi();
  }

  aggiornaPassaggi() {
    this.saloneService.getPassaggi(this.salone, this.intervallo.data1, this.intervallo.data2).subscribe(
      x => {
        this.temps = x;
        this.attesa = false;
        this.totalePassaggi = 0;
        this.temps.forEach(t => this.totalePassaggi = this.totalePassaggi + t.importoUltimaFiche);
      }, (err => {
        this.attesa = false;
        this.notifier.notify('warning', 'Errore nella connessione al server');
      })
    );
  }

  back() {
    this.loc.back();
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  apriFiche(c: Cliente) {
    this.saloneService.getFiche(this.salone, c.idUltimaFiche).subscribe(
      (x:TempFiche) => {
        x.nominativo = c.nome + ' ' + c.cognome;
        x.ingresso= c.dataUltimaFiche;
        const dialogRef = this.dialog.open(PopFicheComponent, {
          width:'95%',
          maxWidth: '350px',
          data: x
        });
      }, (err => {
        this.notifier.notify('warning', 'Errore nella connessione al server');
      })
    );
  }

  receiveMessage($event) {
    this.intervallo.data1 = $event.data1;
    this.intervallo.data2 = $event.data2;
    this.attesa = true;
    this.aggiornaPassaggi();
  }

}
