import { Component, OnInit, ViewChild } from '@angular/core';
import { Salone } from 'src/app/Models/Salone';
import { SaloniService } from 'src/app/Services/saloni.service';
import { CollaboratoriService } from 'src/app/Services/collaboratori.service';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { Cliente } from 'src/app/Models/Cliente';
import { MatSidenav } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { Intervallo } from 'src/app/Models/Intervallo';

@Component({
  selector: 'app-fuori-frequenza',
  templateUrl: './fuori-frequenza.component.html',
  styleUrls: ['./fuori-frequenza.component.scss']
})
export class FuoriFrequenzaComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  pageOfItemsNC: Array<any>;
  pageOfItemsR: Array<any>;

  salone: Salone;

  title = '';

  intervallo: Intervallo;
  temps: Cliente[];
  contattati: Cliente[];
  nonContattati: Cliente[];
  totaleContattati: number = 0;
  totaleNonContattati: number = 0;
  attesa: boolean = true;

  constructor(private router: Router, private saloneService: SaloniService, private loc: Location, private notifier: NotifierService) { }

  ngOnInit() {
    this.salone = this.saloneService.saloneCorrente;
    this.intervallo=JSON.parse(localStorage.getItem('Intervallo'));

    if (this.salone) {
    } else {
      this.salone = JSON.parse(localStorage.getItem("SaloneCorrente"));
    }

    this.aggiornaFuoriFrequenza();

 }

  aggiornaFuoriFrequenza() {
    this.saloneService.getFuoriFrequenza(this.salone, this.intervallo.data1, this.intervallo.data2,'').subscribe(
      x => {
        this.contattati = [];
        this.nonContattati = [];
        this.totaleNonContattati = 0;
        this.totaleContattati = 0;
        this.temps = x;
        this.attesa = false;
        this.temps.forEach(t => {
          if (t.dataUltimoContattato) {
            this.totaleContattati = this.totaleContattati + 1;
            this.contattati.push(t);

          } else {
            this.nonContattati.push(t);
          }
        });
        this.totaleNonContattati = this.temps.length - this.totaleContattati;
      }, (err=> {
        this.attesa = false;
        this.notifier.notify('warning', 'Errore nella connessione al server');
      })
    );
  }

  back() {
    this.loc.back();
  }

  onChangePageNC(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItemsNC = pageOfItems;
}

  onChangePageR(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItemsR = pageOfItems;
}

mostraAnagrafica(e: MouseEvent, idCliente: string) {
  this.router.navigate(['/cliente/' + idCliente]);
}

}
