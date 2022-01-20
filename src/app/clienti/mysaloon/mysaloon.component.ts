import { Component, OnInit, ViewEncapsulation, LOCALE_ID, HostBinding, Pipe, PipeTransform } from '@angular/core';
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
  total = 5;
  counter = this.total;
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
    console.log('gruppo')
    console.log(this.gruppo)
    const app = localStorage.getItem('UserCliente');
    if (!app) {
      return;
    }
    this.user = JSON.parse(app);
    if (!this.user) {
      return;
    }
  }


  backgroundColor: string = '#000000';
  color: string = '#ffffff';
  backgroundUrl:string = '';
  logoUrl:string = '';

  convertBgColor(color): string {
    console.log(color)
    console.log([color.slice(0, color?.lastIndexOf(")")), ',0.66', color.slice(color?.backgroundColor?.lastIndexOf(")"))].join(''))
    return [color.slice(0, color?.lastIndexOf(")")), ',0.66', color.slice(color?.backgroundColor?.lastIndexOf(")"))].join('');

    // [a.slice(0, a.lastIndexOf(")")), ',0.66', a.slice(a.lastIndexOf(")"))].join('');
    //[prenotazioniAttive.backgroundColor.slice(0, prenotazioniAttive.backgroundColor.lastIndexOf() ")), ',0.66', prenotazioniAttive.backgroundColor.slice(prenotazioniAttive.backgroundColor.lastIndexOf(")"))].join('')"
  }

  ngOnInit() {
    
    this.service.getSaloni(this.gruppo).subscribe(x => {
      this.attesa = false;
      this.saloni = x;
      this.selezionaSalone(this.saloni[0]);
      this.getPrenotazioni();
    }, (err => {
      this.attesa = false;
      this.notifier.notify('warning', 'Errore nella connessione al server');
    })
    );

    //setInterval(()=> { this.contoRovescia() }, this.total * 200);
    
  }
 /*  contoRovescia(){
    this.counter = this.counter - 1;
  } */

  selezionandoSaloneFlag() {
    this.selezionandoSalone = true;
  }

  selezionaSalone(salone:Salone) {
    this.saloneSelezionato = salone;
    this.appuntamentiService.GetOpzioniPlanner(salone).subscribe(x => {
      if (x) {
        console.log(x);
        this.saloneSelezionato.opzioniPlanner = x;
        localStorage.setItem('OpzioniPlanner', JSON.stringify(this.saloneSelezionato.opzioniPlanner));
      }
    });
    if (this.saloneSelezionato.opzioniPlanner.imgSfondo && this.saloneSelezionato.opzioniPlanner.imgSfondo != null && this.saloneSelezionato.opzioniPlanner.imgSfondo != ''){
      this.backgroundUrl = '/images/PersonalizzazioniApp/' + (this.saloneSelezionato.gruppo + '/' + this.saloneSelezionato.salone + '/Skin/' + this.saloneSelezionato.opzioniPlanner.imgSfondo).replace(/\s+/g, '_').toLowerCase();
      console.log(this.backgroundUrl)
    }
    if (this.saloneSelezionato.opzioniPlanner.logo && this.saloneSelezionato.opzioniPlanner.logo != null && this.saloneSelezionato.opzioniPlanner.logo != ''){
      this.logoUrl = '/images/PersonalizzazioniApp/' + (this.saloneSelezionato.gruppo + '/' + this.saloneSelezionato.salone + '/Skin/' + this.saloneSelezionato.opzioniPlanner.logo).replace(/\s+/g, '_').toLowerCase();;
      console.log(this.logoUrl)
    }
    this.selectedStyle = `
    --background-color: ${this.backgroundColor};
    --color: ${this.color};
    --background-url: ${this.backgroundUrl};
    --logo-url: ${this.logoUrl}
    `;
    this.style = this.sanitizer.bypassSecurityTrustStyle(this.selectedStyle);

    console.log(this.saloneSelezionato)
    this.selezionandoSalone = false;
  }

  getPrenotazioni() {
    if (this.user) {
      this.saloni.forEach(x => {
        this.appuntamentiService.getEventsOfClient(this.user).subscribe((e: Appuntamento[]) => {
          if (e && e.length > 0) {
            e.forEach(element => {
              element.extendedProps.salone = x.salone;
            });
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


  googleMap(salone: Salone) {
    let href: string = '';
    console.log('idGoogleMap');
    console.log(salone.idGoogleMap);
    if (salone.idGoogleMap) {
      href = 'https://www.google.com/maps/search/?api=1&query_place_id=' + salone.idGoogleMap;
    } else {
      href = 'https://www.google.com/maps/search/?api=1&query=' + salone.gruppo + ', ' + salone.indirizzo + ' ' + salone.cap + ' ' + salone.paese + ' ' + salone.provincia + '&query_place_id=' + salone.idGoogleMap;
    }
    window.location.href = href;
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

