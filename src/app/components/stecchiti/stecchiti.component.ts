import { Component, OnInit } from '@angular/core';
import { Salone } from 'src/app/Models/Salone';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Cliente } from 'src/app/Models/Cliente';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { Stecchiti } from 'src/app/Models/Stecchiti';
import { PopListaComponent } from './pop-lista/pop-lista.component';

@Component({
  selector: 'app-stecchiti',
  templateUrl: './stecchiti.component.html',
  styleUrls: ['./stecchiti.component.scss']
})
export class StecchitiComponent implements OnInit {

  dataSource: Stecchiti[] = [];

  salone: Salone;

  title = '';

  attesa: boolean = true;

  constructor(private router: Router, private saloneService: SaloniService, private loc: Location, private notifier: NotifierService, public dialog: MatDialog) { }

  ngOnInit() {
    this.salone = this.saloneService.saloneCorrente;

    if (this.salone) {
    } else {
      this.salone = JSON.parse(localStorage.getItem("SaloneCorrente"));
    }

    this.aggiornaPassaggi();
  }

  aggiornaPassaggi() {
    this.saloneService.getStecchiti(this.salone).subscribe(
      x => {
        this.dataSource = x;
        this.attesa = false;
      }, (err => {
        this.attesa = false;
        this.notifier.notify('warning', 'Errore nella connessione al server');
      })
    );
  }

  back() {
    this.loc.back();
  }

  dettagli(riga: string, colonna: string) {
    this.saloneService.getStecchitidelMese(this.salone, riga, colonna).subscribe(x => {
      const ris: Cliente[] = x;
      //alert (JSON.stringify(ris));
      const dialogRef = this.dialog.open(PopListaComponent, {
        width: '95%',
        maxWidth: '350px',
        data: ris
      });
    }, (err => {
      this.notifier.notify('warning', 'Errore nella connessione al server');
    })

    );
  }

}
