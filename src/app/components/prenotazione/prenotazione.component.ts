import { Component, OnInit, ViewChild, ElementRef, LOCALE_ID, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from 'src/app/Models/Cliente';
import { SelectComponent } from 'src/app/components/share/select/select.component';
import { registerLocaleData } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Appuntamento } from 'src/app/models/Appuntamento';
import { Esito } from 'src/app/Models/Esito';
import { NuovoClienteComponent } from '../nuovo-cliente/nuovo-cliente.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { User } from 'src/app/Models/User';
import { InputboxComponent } from '../inputbox/inputbox.component';
import localeItalian from '@angular/common/locales/it';
import { CustomDateAdapter } from 'src/app/Services/custom-date-adapter';
registerLocaleData(localeItalian, 'it');

@Component({
  selector: 'app-prenotazione',
  templateUrl: './prenotazione.component.html',
  styleUrls: ['./prenotazione.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: LOCALE_ID, useValue: "it" },
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ]
})
export class PrenotazioneComponent implements OnInit {
  @ViewChild('candidato') txtCandidato: ElementRef;
  @ViewChild('servizio') txtServizio: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('picker') picker: MatDatepicker<Date>;

  listaServizi: Servizio[] = [];
  servizi: Servizio[] = [];
  serviziSelezionati: Servizio[] = [];

  clienteObj: Cliente = new (Cliente);
  clienti: Cliente[];

  formcandidatoGroup: FormGroup;
  formPraticaGroup: FormGroup;
  formPhoneGroup: FormGroup;
  mostraTabella: boolean = false;
  mostraFuoriFrequenza: boolean = false;
  isLinear = false;
  flagNextServizi = true;
  flagNextDisponibilita = true;
  salone: Salone;
  // dataCorrente: Date = new Date();
  orariDisponibili: DisponibilitaPrenotazione;
  oraSelezionata: string = '';
  durataPrenotazione: number = 0;
  prenotazioneSemplice: boolean = false;
  idCollaboratorePrefissato: string = '';
  oraPrefissata: string = '';
  dataPrefissata: string;

  token: string = '';
  idMySaloon: string = '';
  loading: boolean = false;

  dataCorrente: Date = moment(new Date).toDate();

  dataSelezionata: Date = this.dataCorrente;

  settimanaCorrente: Date[] = [];

  firstStepControl:boolean = false;

  public searchForm: FormGroup;

  constructor(private aRoute: ActivatedRoute, private plannerSer: PlannerService, private fb: FormBuilder, public dialog: MatDialog, private auth: AuthService,
    private notifier: NotifierService, private router: Router, private loc: Location, private saloneService: SaloniService,) {
    this.createForm();

    const url = window.location.href;
    if (url.includes('?')) {
      const pos: number = url.indexOf('?') + 7;
      let indirizzo: string = url.substring(pos);
      this.token = decodeURIComponent(indirizzo);
    }

    //this.token = this.aRoute.snapshot.paramMap.get('token');
    // Raggiunto dal cliente
    if (this.token !== null && this.token !== '') {
      this.plannerSer.verificaSaloneFromToken(this.token).subscribe((x: Salone) => {
        console.log(this.token);
        if (x.gruppo !== null && x.gruppo !== '') {
          this.salone = new Salone();
          this.salone.gruppo = x.gruppo;
          this.salone.salone = x.salone;
          this.salone.destinazione = 'web';
          this.caricaServizi();
        } else {
          this.notifier.notify('warning', 'Salone non valido');
        }
      }, err => {
        this.notifier.notify('warning', 'Errore nella connessione al server');
      });
    } else {// Raggiunto dal parrucchiere
      this.idCollaboratorePrefissato = localStorage.getItem('IdCollaboratorePrefissato');
      this.oraPrefissata = localStorage.getItem('OraPrefissata');
      this.dataPrefissata = localStorage.getItem('DataPrefissata');
      if (this.idCollaboratorePrefissato !== null && this.idCollaboratorePrefissato !== '') {
        this.oraSelezionata = '08:00';
        this.dataCorrente = moment(this.dataPrefissata).toDate();
      }
      this.salone = this.saloneService.saloneCorrente;
      if (!this.salone) {
        const a: string[] = localStorage.getItem('PlannerCorrente').split(';');
        this.salone = new Salone();
        this.salone.gruppo = a[0];
        this.salone.salone = a[1];
        this.salone.destinazione = a[2];
        this.salone.indirizzo = a[3];
        this.salone.porta = a[4];
      }
      this.caricaServizi();
    }
    this.orariDisponibili = new DisponibilitaPrenotazione();
    this.orariDisponibili.orariDisponibili = [];
  }

  ngOnInit(): void {
    this.calcolaSettimana(this.dataCorrente);
    this.searchForm = new FormGroup({
      candidato: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      servizio: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
    });

  }

  caricaServizi() {
    this.plannerSer.getServiziInPlanner(this.salone, '').subscribe((x: Servizio[]) => {
      this.servizi = x;
      this.listaServizi = Object.assign([], x);
    });
  }

  createForm() {
    this.formcandidatoGroup = this.fb.group({
      candidato: [''],
    });
    this.formPraticaGroup = this.fb.group({
      tipoPratica: ['', Validators.compose([Validators.required])],
      dataAssunzione: ['', Validators.compose([Validators.nullValidator])],
      mansione: ['', Validators.compose([Validators.required])],
      livello: ['', Validators.compose([Validators.required])],
      annotazioni: [''],
      servizio: ['']

    });
  }

  searchCliente(txt: string) {
    //this.mostraTabella=true;
    if (txt.length > 2) {
      this.plannerSer.getClienti(this.salone, txt).subscribe(
        x => {
          console.log(x);
          this.clienti = x;
          if (this.clienti?.length > 0) {
            this.mostraTabella = true;
          }
        },
        (err) => {
          this.notifier.notify('warning', 'Errore nella connessione al server');
        }
      );
    } else if (txt.length === 0) {
      this.clienti = [];
    }
  }

  selezionaCandidato(cliente: Cliente) {
    this.clienteObj = Object.assign({}, cliente);

    this.txtCandidato.nativeElement.value = this.clienteObj.cognome + ' ' + this.clienteObj.nome;
    this.clienti = [];
    this.mostraTabella = false;
    this.mostraFuoriFrequenza = false;

    this.plannerSer.getCliente(this.salone, cliente.id).subscribe((x: Cliente) => {
      this.clienteObj.serviziFuoriFrequenza = x.serviziFuoriFrequenza;
      if (x.serviziFuoriFrequenza) {
        this.mostraFuoriFrequenza = true;
      }
    });
  }

  scegliOccasionale() {
    this.mostraFuoriFrequenza = false;
    this.plannerSer.getClienteOccasionale(this.salone).subscribe((x: Cliente) => {
      if (x?.id !== '') {

        this.mostraTabella = false;
        //console.log(JSON.stringify(x));
        this.clienteObj = Object.assign({}, x);
        this.txtCandidato.nativeElement.value = 'Cliente occasionale';
        this.clienti = [];
        const dialogRef = this.dialog.open(InputboxComponent, {
          width: '95%',
          maxWidth: '350px',
          data: { titolo: 'Inserisci il nome del cliente', testo: '', placeholder: 'Nome e cognome' }
        });

        dialogRef.afterClosed().subscribe(x => {
          if (x && x !== null && x !== '' && x !== 'x') {
            this.clienteObj.nome = x;
            this.clienteObj.cognome = '';
          }
        });

      } else {
        this.notifier.notify('warning', 'Cliente occasionale non trovato');
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
      if (this.idCollaboratorePrefissato !== null && this.idCollaboratorePrefissato !== '') {
        s.idCollaboratore = this.idCollaboratorePrefissato;
        s.nomeCollaboratore = '';
        this.serviziSelezionati.push(s)
        this.flagNextServizi = false;
      } else {
        if (s.collaboratoriAbilitati) {
          let arr = [];
          arr.push({ value: '', label: 'Tutti' });
          s.collaboratoriAbilitati.forEach(x => {
            arr.push({ value: x.id, label: x.nome + ' ' + x.cognome });
          });
          const dialogRef = this.dialog.open(SelectComponent, {
            width: '95%',
            maxWidth: '450px',
            data: { title: 'Seleziona collaboratore', list: arr }
          });

          dialogRef.afterClosed().subscribe(x => {
            if (x) {
              s.idCollaboratore = x.value;
              s.nomeCollaboratore = x.label;
              s.richiesto = false;
              this.serviziSelezionati.push(s)
              this.flagNextServizi = false;
            }
          });

        } else {
          this.serviziSelezionati.push(s)
          this.flagNextServizi = false;
        }
      }

    }
  }
  removeService(s: Servizio) {
    const index: number = this.serviziSelezionati.indexOf(s);
    this.serviziSelezionati.splice(index, 1);
    if (this.serviziSelezionati.length <= 0) {
      this.flagNextServizi = true;
    }
  }
  serviziPrincipali() {
    const arr = this.servizi.filter(x => {
      return (x.servizio.toLowerCase().startsWith('color', 0) || x.servizio.toLowerCase().startsWith('taglio', 0) || x.servizio.toLowerCase().startsWith('piega', 0) || x.servizio.toLowerCase().startsWith('shampoo', 0));
    });
    return arr;
  }
  serviziSecondari() {
    const arr = this.servizi.filter(x => {
      return !x.servizio.toLowerCase().startsWith('color', 0) && !x.servizio.toLowerCase().startsWith('taglio', 0) && !x.servizio.toLowerCase().startsWith('piega', 0) && !x.servizio.toLowerCase().startsWith('shampoo', 0);
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

  verificaDisponibilita() {
    let p: Prenotazione = new Prenotazione();
    p.cliente = this.clienteObj;
    p.servizi = this.serviziSelezionati;
    p.dataInizio = this.dataSelezionata.toLocaleDateString(); //Per evitare il timezone in dalle 00:00 alle 01:00

    p.gruppo = this.salone.gruppo;
    p.salone = this.salone.salone;
    p.posizione = this.salone.destinazione;
    this.plannerSer.getDisponibilita(this.salone, p).subscribe((x: DisponibilitaPrenotazione) => {
      if (x.errore !== null && x.errore !== '') {
        this.orariDisponibili = new DisponibilitaPrenotazione();
        this.orariDisponibili.errore = x.errore;
        this.orariDisponibili.orariDisponibili = [];
      } else {
        this.orariDisponibili = x;
      }
    }, err => {
      console.log(err);
      this.orariDisponibili = new DisponibilitaPrenotazione();
      this.orariDisponibili.orariDisponibili = [];
      this.notifier.notify('warning', 'Server non raggiungibile');
    });
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

  calcolaSettimana(startDate: Date) {
    for (let i = 0; i < 5; i++) {
      this.settimanaCorrente[i] = moment(startDate).add(i, 'd').toDate();
    }
  }

  settimanaAvanti() {
    for (let i = 0; i < 5; i++) {
      this.settimanaCorrente[i] = moment(this.settimanaCorrente[4]).add(i + 1, 'd').toDate();
    }
  }

  settimanaIndietro() {
    for (let i = 0; i < 5; i++) {
      this.settimanaCorrente[i] = moment(this.settimanaCorrente[i]).subtract(5, 'd').toDate();
    }
  }

  ifDataSelezionata(data: Date): boolean {
    return (data?.toString() === this.dataSelezionata?.toString())
  }

  fineScroll() {
    if (this.dataCorrente.toString() === this.settimanaCorrente[0].toString()) return true;
  }

  selezionaGiorno(data: Date) {
    this.dataSelezionata = data;
    this.verificaDisponibilita();
  }

  selezionaGiornoCalendario(data: Date) {
    this.selezionaGiorno(data);
    this.ricalcolaSettimana(data);
    this.verificaDisponibilita();
  }

  ricalcolaSettimana(data) {
    this.settimanaCorrente[0] = moment(data).subtract(2, 'd').toDate();
    this.settimanaCorrente[1] = moment(data).subtract(1, 'd').toDate();
    this.settimanaCorrente[2] = data;
    this.settimanaCorrente[3] = moment(data).add(1, 'd').toDate();
    this.settimanaCorrente[4] = moment(data).add(2, 'd').toDate();
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
      return (ora >= 13 && ora < 17);
    });
    return arr;
  }

  getSera() {
    const arr = this.orariDisponibili.orariDisponibili.filter(x => {
      const ora: number = moment(x).hour(); //Number.parseInt(x.toString().substring(12,2));
      return (ora >= 17);
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
  }

  confermaPrenotazione() {
    let p: Prenotazione = new Prenotazione();
    p.cliente = this.clienteObj;
    p.servizi = this.serviziSelezionati;
    p.dataInizio = this.dataCorrente.toLocaleDateString();
    p.oraInizio = this.oraSelezionata;

    p.gruppo = this.salone.gruppo;
    p.salone = this.salone.salone;
    p.posizione = this.salone.destinazione;

    if (this.clienteObj && this.clienteObj.id !== '' && this.serviziSelezionati && this.serviziSelezionati.length >= 1 && this.oraSelezionata) {
      if (this.idCollaboratorePrefissato === '') {
        this.loading = true;
        this.plannerSer.getDisponibilitaAtTime(this.salone, p).subscribe((x: boolean) => {
          console.log(x);
          if (x) {
            this.plannerSer.salvaPrenotazione(this.salone, p).subscribe((ris: Esito) => {
              if (ris.esito === 'true') {
                this.loading = false;
                alert('Prenotazione completata.');
                this.back();
              } else {
                this.notifier.notify('warning', 'Prenotazione non memorizzata');
              }
            });
          } else {
            this.loading = false;
            this.notifier.notify('warning', 'Orari non più disponibili. Scegliere un altro orario');
          }
        }, err => {
          this.loading = false;
          console.log(err);
          this.notifier.notify('warning', 'Prenotazione non memorizzata');
        });
      } else {
        p.oraInizio = this.oraPrefissata;
        p.dataInizio = this.dataPrefissata;

        this.loading = true;
        this.plannerSer.salvaPrenotazioneSemplice(this.salone, p).subscribe((ris: Appuntamento[]) => {
          this.loading = false;
          alert('Prenotazione completata.');
          if (ris[0].extendedProps.errors !== null && ris[0].extendedProps.errors !== '') {
            alert(ris[0].extendedProps.errors);
          } else {
            this.back();
          }
        }, err => {
          this.loading = false;
          alert(JSON.stringify(err));
          this.notifier.notify('warning', 'Prenotazione non memorizzata');
        });
      }
    } else {
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

  scrollToTop() {
    window.scroll(0, 0);
  }

  nuovoCliente() {
    localStorage.setItem('GruppoCliente', this.salone.gruppo);
    localStorage.setItem('SaloneCliente', this.salone.salone);

    const dialogRef = this.dialog.open(NuovoClienteComponent, {
      width: '95%',
      maxWidth: '350px',
      data: new User(),
    });

    dialogRef.afterClosed().subscribe(s => {
      if (s) {

        this.plannerSer.getCliente(this.salone, s.id).subscribe((x: Cliente) => {
          this.clienteObj = x;
          if (x.serviziFuoriFrequenza) {
            this.mostraFuoriFrequenza = true;
          }
        });

      }
    });

  }
  setRichiesto(s: Servizio) {
    s.richiesto = !s.richiesto;
  }
  setNotes(s: Servizio) {
    const dialogRef = this.dialog.open(InputboxComponent, {
      width: '95%',
      maxWidth: '350px',
      data: { titolo: 'Inserisci le annotazioni', testo: s.note, placeholder: 'Annotazioni' }
    });

    dialogRef.afterClosed().subscribe(x => {
      if (x && x !== null && x !== '' && x !== 'x') {
        s.note = x;
      }
    });
  }

  back() {
    this.loc.back();
  }
}
