import { Component, OnInit, ViewEncapsulation, LOCALE_ID, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Salone } from 'src/app/Models/Salone';
import { User } from 'src/app/Models/User';
import { AuthClientiService } from 'src/app/Services/auth-clienti.service';
import { PlannerService } from 'src/app/Services/planner.service';
import { Appuntamento } from 'src/app/Models/Appuntamento';
import { MatDialog } from '@angular/material/dialog';
import { DettagliEventoClienteComponent } from '../dettagli-evento-cliente/dettagli-evento-cliente.component';
import { MsgboxComponent } from 'src/app/components/share/msgbox/msgbox.component';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-mysaloon',
  templateUrl: './mysaloon.component.html',
  styleUrls: ['./mysaloon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: LOCALE_ID, useValue: "it" }],
})

export class mysaloonComponent implements OnInit {
  selectedStyle: string;
  @HostBinding('style') style: SafeStyle;

  userLoggedIn: boolean;
  saloni: Salone[];
  attesa: boolean;
  gruppo: string = '';
  user: User;
  selezionandoSalone: boolean = false;
  saloneSelezionato: Salone = new Salone();

  constructor(private sanitizer: DomSanitizer, private dialog: MatDialog, private router: Router, private auth: AuthClientiService, aRoute: ActivatedRoute, private appuntamentiService: PlannerService, private service: SaloniService, private notifier: NotifierService) {
    this.userLoggedIn = auth.isUserLoggedIn();
    this.gruppo = aRoute.snapshot.paramMap.get('id');
    const app = localStorage.getItem('UserCliente');
    if (!app) {
      return;
    }
    this.user = JSON.parse(app);
    if (!this.user) {
      return;
    }
  }


  backgroundColor: string = '#008b8b';
  color: string = '#ffffff';

  ngOnInit() {
    if (!this.service.saloni) {
      this.service.getSaloni(this.gruppo).subscribe(x => {
        this.attesa = false;
        this.saloni = x;
        this.saloneSelezionato = this.saloni[0];
        this.getPrenotazioni();
      }, (err => {
        this.attesa = false;
        this.notifier.notify('warning', 'Errore nella connessione al server');
      })
      );

    } else {
      this.getPrenotazioni();
      this.attesa = false;
    }

    this.selectedStyle = `
    --background-color: ${this.backgroundColor};
    --color: ${this.color};
    `;
    this.style = this.sanitizer.bypassSecurityTrustStyle(this.selectedStyle);

    console.log(this.saloneSelezionato)
  }

  selezionandoSaloneFlag() {
    this.selezionandoSalone = true;
  }

  selezionaSalone(salone) {
    this.saloneSelezionato = salone;
    this.selezionandoSalone = false;
  }

  getPrenotazioni() {
    if (this.user) {
      this.saloni.forEach(x => {
        this.appuntamentiService.getEventsOfClient(this.user).subscribe((e: Appuntamento[]) => {
          if (e && e.length > 0) {
            x.prenotazioniAttive = e;
            console.log(e);
          } else {
            x.prenotazioniAttive = [];
          }
        }, err => {
          console.log(err);
          x.prenotazioniAttive = [];
          this.notifier.notify('warning', 'Errore nella connessione al server ');
        });
      });
    }
  }

  prenota(t: Salone) {
    this.appuntamentiService.GetOpzioniPlanner(t).subscribe(x => {
      if (x) {
        t.opzioniPlanner = x;
        localStorage.setItem('OpzioniPlanner', JSON.stringify(t.opzioniPlanner));
      }
    });
    localStorage.setItem('GruppoCliente', this.gruppo);
    localStorage.setItem('SaloneCliente', t.salone);
    this.router.navigate(['prenotazioneclienti/' + t.salone]);
  }

  chiama(tel: string) {
    window.location.href = 'tel:' + tel;
  }

  login() {
    window.location.href = '#/loginclienti/' + this.gruppo + '/' + localStorage.getItem('SaloneCliente');
  }

  googleMap(t) {
    window.location.href = 'https://www.google.com/maps/search/?api=1&query=' + t.indirizzo + ' ' + t.cap + ' ' + t.paese + ' ' + t.provincia + '&query_place_id=' + t.idGoogleMap;
    console.log('https://www.google.com/maps/search/?api=1&query=' + t.indirizzo + ' ' + t.cap + ' ' + t.paese + ' ' + t.provincia + '&query_place_id=' + t.idGoogleMap)
  }

  dettagliEvento(t: Salone, p: Appuntamento) {

    let tel: string = t.telefono;
    if (tel === null || tel === '') {
      tel = t.cell;
    }
    localStorage.setItem('Telefono', tel);
    const app = {
      s: t,
      p: p,
    }
    const dialogRef = this.dialog.open(DettagliEventoClienteComponent, {
      width: '90%',
      maxWidth: '350px',
      data: app
    });

    dialogRef.afterClosed().subscribe(s => {
      this.getPrenotazioni();
    });
  }

  annullaAppuntamento(appuntamento) {
    appuntamento.extendedProps.gruppo = this.saloneSelezionato.gruppo;
    appuntamento.extendedProps.salone = this.saloneSelezionato.salone;
    if ((appuntamento) && confirm('Annullare l\'appuntamento?')) {
      this.appuntamentiService.richiediAnnullamento(appuntamento).subscribe(x => {
        if (x.esito === 'true') {
          this.saloneSelezionato.prenotazioniAttive = this.saloneSelezionato.prenotazioniAttive.filter(item => item !== appuntamento);
          alert('Eliminazione avvenuta');
        } else {
          alert('Annullamento non riuscito');
        }
      }, err => {
        console.log(err);
        alert('Server non raggiungibile');
      });
    };
  }

  logout() {
    const dialogRef = this.dialog.open(MsgboxComponent, {
      minWidth: '100vw !important',
      minHeight: '100vw !important',
      data: 'Confermi il log-out?'
    });
    dialogRef.afterClosed().subscribe(s => {
      if (s) {
        this.user = null;
        this.auth.logOut();
        this.userLoggedIn = false;
      }
    });
  }

}

