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
  selector: 'app-nuovi-clienti',
  templateUrl: './nuovi-clienti.component.html',
  styleUrls: ['./nuovi-clienti.component.scss']
})
export class NuoviClientiComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  pageOfItemsNC: Array<any>;
  pageOfItemsR: Array<any>;

  salone: Salone;

  Intervalli: any;

  title = '';

  intervallo: Intervallo;
  temps: Cliente[];
  recuperati: Cliente[];
  nuovi: Cliente[];
  totaleRecuperati: number = 0;
  totaleNuoviClienti: number = 0;
  attesa: boolean = true;

  constructor(private router: Router, private saloneService: SaloniService, private loc: Location, private notifier: NotifierService) { }

  ngOnInit() {
    this.salone = this.saloneService.saloneCorrente;
    this.intervallo = JSON.parse(localStorage.getItem('Intervallo'));

    if (this.salone) {
    } else {
      this.salone = JSON.parse(localStorage.getItem("SaloneCorrente"));
    }

    this.aggiornaNuoviClienti();
  }

  aggiornaNuoviClienti() {
    this.saloneService.getNuoviClienti(this.salone, this.intervallo.data1, this.intervallo.data2).subscribe(
      x => {
        this.recuperati = [];
        this.nuovi = [];
        this.totaleNuoviClienti = 0;
        this.totaleRecuperati = 0;
        this.temps = x;
        this.attesa = false;
        this.temps.forEach(t => {
          if (t.dataUltimaFiche) {
            this.totaleRecuperati = this.totaleRecuperati + 1;
            this.recuperati.push(t);
          } else {
            this.nuovi.push(t);
          }
        });
        this.totaleNuoviClienti = this.temps.length - this.totaleRecuperati;
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

receiveMessage($event) {
  this.intervallo.data1=$event.data1;
  this.intervallo.data2=$event.data2;
  this.attesa=true;
  this.aggiornaNuoviClienti();
}

}
