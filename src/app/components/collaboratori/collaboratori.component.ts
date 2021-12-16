import { Component, OnInit, ViewChild } from '@angular/core';
import { Salone } from 'src/app/Models/Salone';
import { SaloniService } from 'src/app/Services/saloni.service';
import { CollaboratoriService } from 'src/app/Services/collaboratori.service';
import { Collaboratore } from 'src/app/Models/Collaboratore';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { Intervallo } from 'src/app/Models/Intervallo';


@Component({
  selector: 'app-collaboratori',
  templateUrl: './collaboratori.component.html',
  styleUrls: ['./collaboratori.component.scss']
})
export class CollaboratoriComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  salone: Salone;

  Intervalli: any;

  title = '';

  attesa: boolean = true;

  intervallo: Intervallo;
  temps: Collaboratore[];
  totaleIncentivi: number;

  constructor(private router: Router, private saloneService: SaloniService, private collService: CollaboratoriService, private loc: Location, private notifier: NotifierService) { }

  ngOnInit() {
    this.salone = this.saloneService.saloneCorrente;
    this.intervallo = JSON.parse(localStorage.getItem('Intervallo'));

    if (this.salone) {
    } else {
      this.salone = JSON.parse(localStorage.getItem("SaloneCorrente"));
    }

    this.aggiornaCollaboratori();
  }

  aggiornaCollaboratori() {
    if (sessionStorage.getItem('Collaboratori') !== '') {
      this.temps = JSON.parse(sessionStorage.getItem('Collaboratori'));
    } else {
      this.saloneService.getStatistiche(this.salone, this.intervallo.data1, this.intervallo.data2).subscribe(
        x => {
          this.temps = x;
          this.totaleIncentivi = 0;
          this.temps.forEach(t => this.totaleIncentivi = this.totaleIncentivi + t.incentivi);
          this.attesa = false;
          sessionStorage.setItem("Collaboratori", JSON.stringify(this.temps));
        }, (err => {
          this.attesa = false;
          this.notifier.notify('warning', 'Errore nella connessione al server');
        })
      );

    }
  }

  apriDettagli(s: Collaboratore) {
    localStorage.setItem("Intervallo", JSON.stringify(this.intervallo));
    this.saloneService.collaboratoreCorrente = s;
    this.router.navigate(['dettagliCollaboratore'])
  }

  receiveMessage($event) {
    this.intervallo.data1 = $event.data1;
    this.intervallo.data2 = $event.data2;
    sessionStorage.setItem('Collaboratori', '');
    this.attesa = true;
    this.aggiornaCollaboratori();
  }

  back() {
    sessionStorage.setItem('Collaboratori', '');
    this.loc.back();
  }
}
