import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Prenotazione } from 'src/app/Models/Prenotazione';
import { Salone } from 'src/app/Models/Salone';
import { User } from 'src/app/Models/User';
import { CalendarOptions } from 'datebook';
import * as moment from 'moment/moment';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-prenotazione-completata',
  templateUrl: './prenotazione-completata.component.html',
  styleUrls: ['./prenotazione-completata.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PrenotazioneCompletataComponent implements OnInit {
  gruppo: string = '';
  salone: Salone;
  user: User;
  prenotazione: Prenotazione;
  linkGoogle: string;

  vapidKeys = {
    "publicKey": "BLBx-hf2WrL2qEa0qKb-aCJbcxEvyn62GDTyyP9KTS5K7ZL0K7TfmOKSPqp8vQF0DaG8hpSBknz_x3qf5F4iEFo",
    "privateKey": "PkVHOUKgY29NM7myQXXoGbp_bH_9j-cxW5cO-fGcSsA"
  };


  constructor(private router: Router, readonly swPush: SwPush) {



    const a: string[] = localStorage.getItem('PlannerCorrente').split(';');

    this.salone = new Salone();
    this.salone.gruppo = localStorage.getItem('GruppoCliente');
    this.salone.salone = localStorage.getItem('SaloneCliente');
    this.salone.destinazione = a[2];
    this.salone.indirizzo = a[3];
    this.salone.porta = a[4];
    this.user = JSON.parse(localStorage.getItem('UserCliente'));

    this.prenotazione = JSON.parse(localStorage.getItem('Prenotazione'));
    let servizi: string = '';
    let tempo: number = 0;
    this.prenotazione.servizi.forEach(x => {
      servizi = servizi + x.servizio + ',';
      tempo = tempo + x.durata;
    })
    const details: string = 'Servizi prenotati: ' + servizi;
    let dataFine: Date = new Date(this.prenotazione.oraInizio);
    dataFine.setMinutes(dataFine.getMinutes() + tempo);
    let inizio: string = moment(this.prenotazione.oraInizio).year() + ('0' + (moment(this.prenotazione.oraInizio).month() + 1)).substr(-2) + ('0' + moment(this.prenotazione.oraInizio).date()).substr(-2) + 'T' + ('0' + moment(this.prenotazione.oraInizio).hour()).substr(-2) + ('0' + moment(this.prenotazione.oraInizio).minutes()).substr(-2);
    let fine: string = dataFine.getFullYear() + ('0' + (moment(dataFine).month() + 1)).substr(-2) + ('0' + moment(dataFine).date()).substr(-2) + 'T' + ('0' + dataFine.getHours()).substr(-2) + ('0' + dataFine.getMinutes()).substr(-2);
    console.log(this.prenotazione.oraInizio);
    console.log(inizio);
    console.log(fine);

    //formatDate(this.prenotazione.oraInizio,'yyyyMMddTHH:mm','en-EN').replace(':','')

    this.linkGoogle = 'https://www.google.com/calendar/event?action=TEMPLATE&dates=' + inizio.replace(':', '') + '%2F' + fine.replace(':', '') + '&text=' + this.salone.gruppo + '&location=' + this.salone.salone + '&details=' + details;
    //window.location.href=this.linkGoogle;
  }


  ngOnInit(): void {
    let servizi: string = '';
    let tempo: number = 0;
    this.prenotazione.servizi.forEach(x => {
      servizi = servizi + x.servizio + ','
      tempo = tempo + x.durata;
    })
    let dataInizio: Date = new Date(this.prenotazione.oraInizio);
    let dataFine: Date = new Date(this.prenotazione.oraInizio);
    dataFine.setMinutes(dataFine.getMinutes() + tempo);

    let config: CalendarOptions = {
      title: "Prenotazione da " + this.salone.gruppo + '(' + this.salone.salone + ')',
      location: this.salone.salone,
      description: 'Servizi prenotati: ' + servizi,
      start: dataInizio,
      end: dataFine,
      /* attendees: [ // partecipanti
        {
          name: 'John Doe',
          email: 'john@doe.com',
          icsOptions: {
            rsvp: true
          }
        },
        {
          name: 'Jane Doe',
          email: 'jane@doe.com'
        }
      ], */
      // an event that recurs every two weeks:
      /* recurrence: {
        frequency: 'WEEKLY',
        interval: 2
      } */
    }
    //const icalendar = new ICalendar(config)
    //icalendar.download()
  }

  salvaGoogleCalendar() {
    window.location.href = this.linkGoogle;
  }

  home() {
    this.router.navigate(['mysaloon/' + this.salone.gruppo], { replaceUrl: true });
  }

  async subscribeToNotifications() {

    try {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.vapidKeys.publicKey,
      });
      // TODO: Send to server.
    } catch (err) {
      console.error('Could not subscribe due to:', err);
    }

  }
}