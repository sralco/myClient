import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, LOCALE_ID, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from 'src/app/Models/Cliente';
import { SelectComponent } from 'src/app/components/share/select/select.component';
import { MatPaginator } from '@angular/material/paginator';
import { NotifierService } from 'angular-notifier';
import { AuthService } from 'src/app/Services/auth.service';
import { PlannerService } from 'src/app/Services/planner.service';
import { Servizio } from 'src/app/Models/Servizio';
import { Location } from '@angular/common';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Salone } from 'src/app/Models/Salone';
import { Prenotazione } from 'src/app/Models/Prenotazione';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment/moment';
import { DisponibilitaPrenotazione } from 'src/app/Models/DisponibilitaPrenotazione';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/Models/User';
import { Esito } from 'src/app/Models/Esito';
import { MatStepper } from '@angular/material/stepper';
import { MsgboxComponent } from 'src/app/components/share/msgbox/msgbox.component';
import { SwPush } from '@angular/service-worker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import localeItalian from '@angular/common/locales/it';
import { CustomDateAdapter } from 'src/app/Services/custom-date-adapter';
registerLocaleData(localeItalian, 'it');


@Component({
  selector: 'app-prenotazione-clienti',
  templateUrl: './prenotazione-clienti.component.html',
  styleUrls: ['./prenotazione-clienti.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: LOCALE_ID, useValue: "it" },
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ]
})


export class PrenotazioneClientiComponent implements OnInit {

  @ViewChild("cercaForm") cercaForm: ElementRef;
  selectedStyle: string;
  @HostBinding('style') style: SafeStyle;

  @ViewChild('servizio') txtServizio: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('picker') picker: MatDatepicker<Date>;
  @ViewChild('stepper') private myStepper: MatStepper;

  vapidKeys = {
    "publicKey": "BLBx-hf2WrL2qEa0qKb-aCJbcxEvyn62GDTyyP9KTS5K7ZL0K7TfmOKSPqp8vQF0DaG8hpSBknz_x3qf5F4iEFo",
    "privateKey": "PkVHOUKgY29NM7myQXXoGbp_bH_9j-cxW5cO-fGcSsA"
  };

  listaServizi: Servizio[] = [];
  servizi: Servizio[] = [];
  serviziSelezionati: Servizio[] = [];
  serviziObbligatori: Servizio[] = [];

  serviziCaricati: boolean = false;

  prenotazioneConfermata: Prenotazione = new Prenotazione();


  dc: boolean = false;

  esito: boolean = false;

  linkGoogle: string;


  flagCercaServizi: boolean = false;

  clienteObj: Cliente = new (Cliente);

  valid1 = new FormControl('');
  valid2 = new FormControl('');

  formcandidatoGroup: FormGroup;
  formPraticaGroup: FormGroup;
  formPhoneGroup: FormGroup;
  mostraTabella: boolean = false;
  mostraFuoriFrequenza: boolean = false;
  isLinear = false;
  flagNextServizi = true;
  flagNextDisponibilita = true;
  salone: Salone;

  //dataCorrente: Date = new Date();

  dataCorrente: Date = moment(new Date).toDate();

  dataSelezionata: Date = this.dataCorrente;

  settimanaCorrente: Date[] = [];

  orariDisponibili: DisponibilitaPrenotazione;
  oraSelezionata: string = '';
  durataPrenotazione: number = 0;

  token: string = '';
  idMySaloon: string = '';
  isLoading: boolean = false;
  isLoadingDisponibilita: boolean = false;
  notificationEnabled: boolean = this.swPush.isEnabled;

  logoUrl:string = '';

  currentTimestamp: any;


  public searchForm: FormGroup;

  user: User;

  constructor(private sanitizer: DomSanitizer, private dateAdapter: DateAdapter<any>, private swPush: SwPush, private aRoute: ActivatedRoute, private plannerSer: PlannerService, private fb: FormBuilder, public dialog: MatDialog, private auth: AuthService,
    private notifier: NotifierService, private router: Router, private loc: Location, private saloneService: SaloniService) {
    this.createForm();
    this.dateAdapter.setLocale('it');

    this.setState(this.valid1, true);
    this.setState(this.valid2, true);

    const a: string[] = localStorage.getItem('PlannerCorrente').split(';');
    this.orariDisponibili = new DisponibilitaPrenotazione();
    this.orariDisponibili.orariDisponibili = [];

    this.salone = new Salone();
    this.salone.gruppo = localStorage.getItem('GruppoCliente');
    this.salone.salone = localStorage.getItem('SaloneCliente');
    this.salone.destinazione = a[2];
    this.salone.indirizzo = a[3];
    this.salone.porta = a[4];
    this.salone.opzioniPlanner = JSON.parse(localStorage.getItem('OpzioniPlanner'));

    this.user = JSON.parse(localStorage.getItem('UserCliente'));

    this.clienteObj = new Cliente();
    this.clienteObj.id = this.user.idClienteMySaloon ? this.user.idClienteMySaloon : 'EXT' + this.user.id;
    this.clienteObj.nome = this.user.nome;
    this.clienteObj.cognome = this.user.cognome;
    this.selezionaCandidato(this.clienteObj);

    this.caricaServizi();
  }

  backgroundColor: string = '#000000';
  color: string = '#ffffff';

  ngOnInit(): void {

    this.currentTimestamp = moment(new Date()).format('DD/MM/yyyy');

    this.calcolaSettimana(this.dataCorrente);

    console.log('notification')
    console.log(this.notificationEnabled);

    this.searchForm = new FormGroup({
      servizio: new FormControl(''),
    });

    this.selectedStyle = `
    --background-color: ${this.backgroundColor};
    --color: ${this.color};
    `;
    this.style = this.sanitizer.bypassSecurityTrustStyle(this.selectedStyle);

    let opzioniPlanner: any;

    opzioniPlanner = JSON.parse(localStorage.getItem('OpzioniPlanner'));

    if (opzioniPlanner.logo && opzioniPlanner.logo != null && opzioniPlanner.logo != ''){
      this.logoUrl = 'assets/' + opzioniPlanner.logo;
    }

  }

  setState(control: FormControl, state: boolean) {
    if (state) {
      control.setErrors({ "required": true });
    } else {
      control.reset();
    }
  }

  calcolaSettimana(startDate: Date) {
    for (let i = 0; i < 6; i++) {
      this.settimanaCorrente[i] = moment(startDate).add(i, 'd').toDate();
    }
  }

  settimanaAvanti() {
    for (let i = 0; i < 6; i++) {
      this.settimanaCorrente[i] = moment(this.settimanaCorrente[5]).add(i+1, 'd').toDate();
    }
  }

    settimanaIndietro() {
      for (let i = 0; i < 6; i++) {
          this.settimanaCorrente[i] = moment(this.settimanaCorrente[i]).subtract(6, 'd').toDate();
      }
    }

  caricaServizi() {
    this.plannerSer.getServiziInPlanner(this.salone, '').subscribe((x: Servizio[]) => {
      this.servizi = x;
      this.listaServizi = Object.assign([], x);
      this.serviziObbligatori = [];
      this.servizi.forEach(x => {
        if (x.obbligatorio) {
          this.serviziObbligatori.push(x);
        }
      })
      this.serviziCaricati = true;
    });
  }

  createForm() {
    this.formPraticaGroup = this.fb.group({
      tipoPratica: ['', Validators.compose([Validators.required])],
      dataAssunzione: ['', Validators.compose([Validators.nullValidator])],
      mansione: ['', Validators.compose([Validators.required])],
      livello: ['', Validators.compose([Validators.required])],
      annotazioni: [''],
      servizio: ['']
    });
  }


  fineScroll(){
    if (this.dataCorrente.toString() === this.settimanaCorrente[0].toString()) return true;
  }

  selezionaCandidato(cliente: Cliente) {
    this.clienteObj = Object.assign({}, cliente);

    this.mostraFuoriFrequenza = false;

    this.plannerSer.getCliente(this.salone, cliente.id).subscribe((x: Cliente) => {
      if (x?.serviziFuoriFrequenza) {
        this.clienteObj.serviziFuoriFrequenza = x.serviziFuoriFrequenza;
        this.mostraFuoriFrequenza = true;
      }
    });
  }

  searchServizi(txt: string) {
    if (txt.length > 1) {
      const arr = this.listaServizi.filter(x => { return x.servizio.toLowerCase().includes(txt.toLowerCase()) })
      this.servizi = arr;
    } else if (txt.length === 0) {
      this.servizi = Object.assign([], this.listaServizi);
    }
  }

  selezionaServizio(s: Servizio) {
    let flag: boolean = false;

    this.serviziSelezionati.forEach(e => {
      if (e.id === s.id) {
        flag = true;
      }
    });
    if (!flag) {
      if (s.collaboratoriAbilitati) {
        console.log(s.collaboratoriAbilitati);
        let arr = [];
        arr.push({ value: '', label: 'Tutti i collaboratori', foto: '' });
        s.collaboratoriAbilitati.forEach(x => {
          arr.push({ value: x.id, label: x.nome + ' ' + x.cognome, foto: x.foto });
        });

        let flagCabina: boolean = true;
        console.log(s.collaboratoriAbilitati)

        s.collaboratoriAbilitati.forEach(x => {
          if (x.tipo !== 'Cabina') {
            flagCabina = false;
          }
        });

        if (flagCabina) {
          s.idCollaboratore = 'Tutti';
          s.nomeCollaboratore = 'Tutti i collaboratori';
          this.serviziSelezionati.push(s);
          this.flagNextServizi = false;

        } else {
          const dialogRef = this.dialog.open(SelectComponent, {
            width: '95%',
            maxWidth: '350px',
            data: { title: 'Seleziona collaboratore', list: arr }
          });

          dialogRef.afterClosed().subscribe(x => {
            if (x) {
              s.idCollaboratore = x.value;
              s.nomeCollaboratore = x.label;
              this.serviziSelezionati.push(s)
              this.flagNextServizi = false;
            }
          });

        }


      } else {
        this.serviziSelezionati.push(s)
        this.flagNextServizi = false;
      }
      this.setState(this.valid1, false);
    }
    this.cleatTxt('servizio');
  }

  removeService(s: Servizio) {
    const index: number = this.serviziSelezionati.indexOf(s);
    this.serviziSelezionati.splice(index, 1);
    if (this.serviziSelezionati.length <= 0) {
      this.flagNextServizi = true;
      this.setState(this.valid1, true);
    }
  }

  serviziPrincipali() {
    const arr = this.servizi.filter(x => {
      /*       return (x.servizio.toLowerCase().startsWith('color', 0) || x.servizio.toLowerCase().startsWith('taglio', 0) || x.servizio.toLowerCase().startsWith('piega', 0)
              || x.servizio.toLowerCase().startsWith('shampoo', 0) || x.servizio.toLowerCase().startsWith('barba', 0) || x.principale);
       */
      return (x.principale);
    });
    return arr;
  }

  serviziSecondari() {
    const arr = this.servizi.filter(x => {
      /*       return !x.servizio.toLowerCase().startsWith('color', 0) && !x.servizio.toLowerCase().startsWith('taglio', 0) && !x.servizio.toLowerCase().startsWith('piega', 0)
              && !x.servizio.toLowerCase().startsWith('shampoo', 0) && !x.servizio.toLowerCase().startsWith('barba', 0) && !x.principale;
       */
      return (!x.principale);
    });
    return arr;
  }

  getServiziScelti() {
    let txt: string = '';
    let durata: number = 0;
    this.serviziSelezionati.forEach(x => {
      txt = txt + ', ' + x.servizio;
      if (!x.tempoDiPosa) {
        x.tempoDiPosa = 0;
      }
      durata += x.durata + x.tempoDiPosa;
    });
    if (txt.length > 1) {
      txt = txt.substring(1);
    }
    this.durataPrenotazione = durata;
    return txt;
  }

  SceltoServizioObbligatorio(): boolean {
    if (this.serviziObbligatori.length > 0) {
      let flag: boolean = false;
      this.serviziSelezionati.forEach(x => {
        this.serviziObbligatori.forEach(y => {
          if (x.id === y.id) {
            console.log(x.id + ' ' + y.id + ' ' + (x.id === y.id));
            flag = true;
          }
        });
      });
      return flag;
    } else {
      return true;
    }
  }

  TestoServiziObbligatori(): string {
    let txt: string = '';
    this.serviziObbligatori.forEach(y => {
      txt += y.servizio + '\n';
    });
    return txt;
  }

  verificaDisponibilita() {
    if (!this.SceltoServizioObbligatorio()) {
      console.log(this.TestoServiziObbligatori());
      alert('Selezionare uno tra i seguenti servizi prima di andare avanti:' + '\n' + this.TestoServiziObbligatori());
      this.flagNextDisponibilita = true;
      this.myStepper.previous();
      return;
    }

    this.oraSelezionata = '';
    this.flagNextDisponibilita = true;
    this.isLoadingDisponibilita = true;
    let p: Prenotazione = new Prenotazione();
    p.cliente = this.clienteObj;
    p.servizi = this.serviziSelezionati;
    //p.dataInizio = moment(this.dataCorrente).toISOString();
    p.dataInizio = moment(this.dataSelezionata).date() + '/' + (moment(this.dataSelezionata).month() + 1) + '/' + moment(this.dataSelezionata).year();

    console.log(this.dataSelezionata);
    console.log(p.dataInizio);
    //p.dataInizio = this.dataCorrente.toLocaleDateString(); //Per evitare il timezone in dalle 00:00 alle 01:00
    p.gruppo = this.salone.gruppo;
    p.salone = this.salone.salone;
    p.posizione = this.salone.destinazione;
    this.isLoadingDisponibilita = true;
    this.plannerSer.getDisponibilita(this.salone, p).subscribe((x: DisponibilitaPrenotazione) => {
      this.isLoadingDisponibilita = false;
      if (x.errore !== null && x.errore !== '') {
        console.log(x.errore);
        this.orariDisponibili = new DisponibilitaPrenotazione();
        this.orariDisponibili.errore = x.errore;
        this.orariDisponibili.orariDisponibili = [];
      } else {
        this.orariDisponibili = x;
        
      }

    }, err => {
      console.log(err);
      this.isLoadingDisponibilita = false;
      this.orariDisponibili = new DisponibilitaPrenotazione();
      this.orariDisponibili.orariDisponibili = [];
      this.notifier.notify('warning', 'Errore nella connessione al server');
    });
    this.isLoadingDisponibilita = false;
    //if (this.orariDisponibili.orariDisponibili == []) this.orariDisponibili.errore = 'Orario non disponibile';
  }

  cambiaGiorno(direzione: string) {
    if (direzione === 'avanti') {
      this.dataCorrente = new Date(this.dataCorrente.setDate(this.dataCorrente.getDate() + 1));
    } else if (direzione === 'indietro') {
      let oggi: Date = new Date();
      if (this.dataCorrente.toLocaleDateString() === oggi.toLocaleDateString()) {
      } else {
        this.dataCorrente = new Date(this.dataCorrente.setDate(this.dataCorrente.getDate() - 1));
      }
    } else if (direzione === '') {
      this.dataCorrente = new Date();
    }
    this.verificaDisponibilita();
  }

  openDatePicker() {
    this.picker.open();
  }

  updateDate(event) {
    this.dataCorrente = moment(event.value, 'dd/MM/yyyy').toDate();
    this.verificaDisponibilita();
  }



  selezionaGiorno(sc: Date) {
    this.dataSelezionata = sc;
    this.verificaDisponibilita();
  }

  ifDataSelezionata(data: Date): boolean {
    return (data?.toString() === this.dataSelezionata?.toString())
  }

  getMattino() {
    const arr = this.orariDisponibili.orariDisponibili.filter(x => {
      const ora: number = moment(x).hour(); //Number.parseInt(x.toString().substring(12,2));
      return (ora < 13);
    });
    return arr;
  }

  getPomeriggio() {
    const arr = this.orariDisponibili.orariDisponibili.filter(x => {
      const ora: number = moment(x).hour(); //Number.parseInt(x.toString().substring(12,2));
      return (ora >= 13 && ora < 18);
    });
    return arr;
  }

  getSera() {
    const arr = this.orariDisponibili.orariDisponibili.filter(x => {
      const ora: number = moment(x).hour(); //Number.parseInt(x.toString().substring(12,2));
      return (ora >= 18);
    });
    return arr;
  }

  getColor(ora) {
    if (this.oraSelezionata === ora) {
      return "accent";
    } else {
      return "basic";
    }
  }

  selezionaOra(ora: Date) {
    this.flagNextDisponibilita = false;
    this.oraSelezionata = ora.toString();
    this.setState(this.valid2, false);
  }

  confermaPrenotazione() {

    let p: Prenotazione = new Prenotazione();
    p.cliente = this.clienteObj;
    p.servizi = this.serviziSelezionati;
    //p.dataInizio = this.dataCorrente.toLocaleDateString();
    p.dataInizio = moment(this.dataSelezionata).date() + '/' + (moment(this.dataSelezionata).month() + 1) + '/' + moment(this.dataSelezionata).year();
    p.oraInizio = this.oraSelezionata;

    p.gruppo = this.salone.gruppo;
    p.salone = this.salone.salone;
    p.posizione = this.salone.destinazione;
    if (this.clienteObj && this.clienteObj.id !== '' && this.serviziSelezionati && this.serviziSelezionati.length >= 1 && this.oraSelezionata) {
      this.isLoading = true;
      this.plannerSer.getDisponibilitaAtTime(this.salone, p).subscribe((x: boolean) => {
        console.log(x);
        if (x) {
          this.plannerSer.salvaPrenotazione(this.salone, p).subscribe((ris: Esito) => {
            if (ris.esito === 'true') {
              localStorage.setItem('Prenotazione', JSON.stringify(p));
              this.esito = true;
              //this.router.navigate(['prenotazionecompletata']);
              this.prenotazioneConfermata = p;
              let servizi: string = '';
              let tempo: number = 0;
              p.servizi.forEach(x => {
                servizi = servizi + x.servizio + ', ';
                tempo = tempo + x.durata;
              });
              servizi = servizi.slice(0, -2);

              let arr = this.salone.gruppo.split(" ");
              for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

              }
              const text = arr.join(" ");
              let googleLocation: string = text + ', ' + this.salone.salone + ', ' + this.salone.indirizzo;

              console.log(googleLocation)
              let dataFine: Date = new Date(this.prenotazioneConfermata.oraInizio);
              dataFine.setMinutes(dataFine.getMinutes() + tempo);
              let inizio: string = moment(this.prenotazioneConfermata.oraInizio).year() + ('0' + (moment(this.prenotazioneConfermata.oraInizio).month() + 1)).substr(-2) + ('0' + moment(this.prenotazioneConfermata.oraInizio).date()).substr(-2) + 'T' + ('0' + moment(this.prenotazioneConfermata.oraInizio).hour()).substr(-2) + ('0' + moment(this.prenotazioneConfermata.oraInizio).minutes()).substr(-2);
              let fine: string = dataFine.getFullYear() + ('0' + (moment(dataFine).month() + 1)).substr(-2) + ('0' + moment(dataFine).date()).substr(-2) + 'T' + ('0' + dataFine.getHours()).substr(-2) + ('0' + dataFine.getMinutes()).substr(-2);
              this.linkGoogle = 'https://www.google.com/calendar/event?action=TEMPLATE&dates=' + inizio.replace(':', '') + '%2F' + fine.replace(':', '') + '&text=' + text + '&location=' + googleLocation + '&details=' + servizi + '&trp=false&sprop=&sprop=name:';
              this.myStepper.next();
            } else {
              console.log(ris.messaggio);
              this.notifier.notify('warning', 'Errore nella connessione al server');
            }
          }, err => {
            console.log(err);
            this.notifier.notify('warning', 'Errore nella connessione al server');
          });
        } else {
          this.isLoading = false;
          this.notifier.notify('warning', 'Orari non più disponibili. Scegli un altro orario');
        }
      }, err => {
        console.log(err);
        this.notifier.notify('warning', 'Errore nella connessione al server');
      });
    } else {
      this.isLoading = false;
      this.notifier.notify('warning', 'Tutti i campi sono obbligatori');
    }
  }

  cleatTxt(campo: string) {
    if (campo === 'candidato') {
      this.searchForm.get('candidato').reset('');
    } else if (campo === 'servizio') {
      this.searchForm.get('servizio').reset('');
      this.searchServizi('');
    }
    this.mostraTabella = false;
  }

  setFlagCercaServizi() {
    this.flagCercaServizi = !this.flagCercaServizi;
    const ele = this.cercaForm.nativeElement['servizio'];
    if (ele) {
      ele.focus();
    }

  }

  scrollToTop() {
    window.scroll(0, 0);
  }

  back() {
    this.router.navigate(['mysaloon/' + this.salone.gruppo]);
  }

  logout() {
    const dialogRef = this.dialog.open(MsgboxComponent, {
      width: '95%',
      maxWidth: '350px',
      data: 'Confermi il log-out?'
    });
    dialogRef.afterClosed().subscribe(s => {
      if (s) {
        this.user = null;
        this.auth.logOut();
      }
    });
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
      }).then(PushSubscription => {
        console.log(PushSubscription)
      });
      // TODO: Send to server.
    } catch (err) {
      console.error('Could not subscribe due to:', err);
    }

  }

}
