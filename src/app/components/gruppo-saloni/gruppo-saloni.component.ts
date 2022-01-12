import { Salone } from 'src/app/Models/Salone';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SaloniService } from '../../Services/saloni.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { AuthService } from 'src/app/Services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { Intervallo } from 'src/app/Models/Intervallo';
import { VociMenu } from 'src/app/Models/VociMenu';
import { MatDialog } from '@angular/material/dialog';
import { LogEventiComponent } from '../log-eventi/log-eventi.component';
import { Location } from '@angular/common';
import * as moment from 'moment/moment';
import { User } from 'src/app/Models/User';
import { RealtimeService } from 'src/app/Services/realtime.service';
import { TempFiche } from 'src/app/Models/Temp-Fiche';
import { InAttesaComponent } from '../in-attesa/in-attesa.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';


@Component({
  selector: 'app-gruppo-saloni',
  templateUrl: './gruppo-saloni.component.html',
  styleUrls: ['./gruppo-saloni.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ]
})

export class GruppoSaloniComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  title = '';
  temps: Salone[];
  anno1: number;
  anno2: number;
  saloniCaricati: boolean = false;
  attesa: boolean = true;
  intervallo: Intervallo;
  menu: VociMenu;
  modalitaConsulente: boolean;

  barChartOptions: ChartOptions = this.createOptions();
  barChartLabels: Label[] = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'ott', 'Nov', 'Dic'];
  barChartLabelsClassi: Label[] = ['A', 'B', 'C', 'D', 'Inattivi'];
  barChartType: ChartType = 'line';
  barChartLegend = false;
  barChartPlugins = [];
  user: User;

  /* barChartData: ChartDataSets[] = [
    { data: [45, 37, 60, 70, 46, 33, 45, 65, 23, 87, 33, 55], label: 'Precedente' },
    { data: [55, 20, 50, 80, 60, 50, 66, 45, 87, 23, 55, 43], label: 'Corrente' },
  ]; */

  private createOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      //onResize:(newSize),
      //elements: { point: { radius: 0 } }, //Rimuove i punti dalle linee
      legend: { position: 'top' },
      hover: { animationDuration: 0 },
      animation: { duration: 2 },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: "rgba(0,0,0,0.5)",
            fontStyle: "bold",
            beginAtZero: true,
            maxTicksLimit: 5,
            padding: 20
          },
          gridLines: {
            drawTicks: false,
            display: false
          }

        }],
        xAxes: [{
          gridLines: { zeroLineColor: "transparent" },
          ticks: {
            padding: 20,
            fontColor: "rgba(0,0,0,0.5)",
            fontStyle: "bold"
          }
        }]
      }
    };
  }

//   handleResize() {
//     var w = window.innerWidth-2; // -2 accounts for the border
//     var h = window.innerHeight-2;
//     stage.canvas.width = w;
//     stage.canvas.height = h;
//     //
//     var ratio = 100/100; // 100 is the width and height of the circle content.
//     var windowRatio = w/h;
//     var scale = w/100;
//     if (windowRatio > ratio) {
//         scale = h/100;
//     }
//     // Scale up to fit width or height
//     c.scaleX= c.scaleY = scale; 
    
//     // Center the shape
//     c.x = w / 2;
//     c.y = h / 2;
        
//     stage.update();
// }

  constructor( private serviceRT: RealtimeService, private router: Router, private loc: Location, private route: ActivatedRoute, private service: SaloniService, private auth: AuthService, private notifier: NotifierService, public dialog: MatDialog,) {
    this.menu = new VociMenu;
    this.intervallo = new Intervallo;
    this.modalitaConsulente = !!localStorage.getItem('ModalitaConsulente');
    const app = localStorage.getItem('user');
    if (app) {
      this.user = JSON.parse(app);
      if (this.user.tipo === 'Receptionist') {
        router.navigate(['planner']);
      } else if (this.user.tipo === 'Collaboratore') {
        router.navigate(['dettagliCollaboratore']);
      }
    }
  }

  /*riceviDati(){
    this.route.paramMap.pipe(
      switchMap((params:ParamMap):ObservableInput<any> => {
        alert('param.key: ' + params.keys);
        return new Observable<any>((observer) => {
          observer.next(params.get('id'))
          observer.complete();
          return {unsubscribe(){}};
        });
      })
    ).subscribe(data => {
      alert('data :' + data);
    })
  }*/

  ngOnInit() {
    let dataImpostazioneIntervallo: string = localStorage.getItem('DataImpostazioneIntervallo')
    if (!dataImpostazioneIntervallo) {
      localStorage.setItem('DataImpostazioneIntervallo', JSON.stringify(new Date()));
      dataImpostazioneIntervallo = JSON.stringify(new Date())
    }

    if (this.modalitaConsulente) {
      this.title = localStorage.getItem('Consulente');
    } else {
      this.title = localStorage.getItem('GruppoSaloni');
    }

    this.intervallo.data1 = new Date().toLocaleDateString();
    this.intervallo.data2 = this.intervallo.data1;
    this.intervallo.name = 'Oggi ' + this.intervallo.data1;
    this.intervallo.codice = 'oggi';

    this.menu.giorno = this.intervallo.data1;
    this.menu.settimana = this.service.settimanaCorrente();
    this.menu.mese = this.service.meseCorrente();
    this.menu.anno = this.service.annoCorrente();
    this.menu.dieci = this.service.getDieci(new Date());


    this.anno1 = new Date().getFullYear();
    this.anno2 = (new Date().getFullYear() - 1);

    if (localStorage.getItem("Intervallo")) {
      const dd: Date = moment(dataImpostazioneIntervallo, 'YYYY-MM-DD').toDate();
      let dataImpostazione: Date = new Date(dd.getFullYear(), dd.getMonth(), dd.getDate());
      let dataOggi: Date = new Date();

      if (dataImpostazione < new Date(dataOggi.getFullYear(), dataOggi.getMonth(), dataOggi.getDate())) {
        this.intervallo.data1 = new Date().toLocaleDateString();
        this.intervallo.data2 = this.intervallo.data1;
        this.intervallo.codice = 'oggi';
        this.intervallo.name = 'Oggi ' + this.intervallo.data1;

        this.memorizzaDati();
      } else {
        this.intervallo = JSON.parse(localStorage.getItem('Intervallo'));
        this.anno1 = Number.parseInt(this.intervallo.data2.substr(this.intervallo.data2.length - 4));
        this.anno2 = this.anno1 - 1;

        if (this.intervallo.data1 === this.intervallo.data2 && this.intervallo.codice !== 'Giorno') {
          this.intervallo.data1 = new Date().toLocaleDateString();
          this.intervallo.data2 = this.intervallo.data1;
          this.intervallo.codice = 'oggi';
          this.intervallo.name = 'Oggi ' + this.intervallo.data1;

          this.memorizzaDati();
        }

      }
    }


    if (!this.service.saloni) {
      this.service.getSaloni(this.title).subscribe(
        x => {
          localStorage.setItem("Scroll", '0');
          this.saloniCaricati = true;
          this.temps = x;
          this.temps.forEach(element => {
            element.posizione = 'In attesa...'
            element.attesa = true;
            element.classeAccordion = 'collapse multi-collapse';
            this.caricaSaloni(element);
            this.attesa = false;
          });
        }, (err => {
          this.attesa = false;
          this.notifier.notify('warning', 'Errore nella connessione al server');
        })
      );

    } else {
      this.temps = this.service.saloni;
      this.saloniCaricati = true;
      this.attesa = false;
      this.temps.forEach(x => {
        //alert(x.aperto);
        if (x.aperto === 'show') {
          x.classeAccordion = '';
        }
      })
    }
  }

  aggiorna(t: Salone) {
    t.posizione = 'In attesa...'
    t.attesa = true;
    t.classeAccordion = 'collapse multi-collapse';
    this.caricaSaloni(t);
  }

  ngAfterViewInit() {
    const y = Number(sessionStorage.getItem("Scroll"));
    //alert(y);
    if (+y > 0) {
      var el = document.querySelector('#divToScroll');
      el.scrollTo(0, y);
      //alert(el.scrollTop);
    }
    sessionStorage.setItem("Scroll", '0');
  }

  memorizzaDati() {
    localStorage.setItem("Intervallo", JSON.stringify(this.intervallo));
  }

  caricaSaloni(s: Salone) {
    s.produzione1 = 0;
    s.produzione2 = 0;
    s.incasso1 = 0;
    s.incasso2 = 0;
    s.passaggi1 = 0;
    s.passaggi2 = 0;
    s.spese1 = 0;
    s.spese2 = 0;
    s.media1 = 0;
    s.media2 = 0;
    s.nuoviClienti1 = 0;
    s.nuoviClienti2 = 0;
    s.clientiMovimentati1 = 0;
    s.clientiMovimentati2 = 0;
    s.destinazione = 'PC';
    s.logEventi = [];

    /*     this.service.getSalone(s, this.intervallo.data1, this.intervallo.data2).subscribe(
          x => {
            this.temps.forEach(element => {
              if ((element.salone === s.salone) && (element.porta === s.porta)) {
                s.posizione = 'Real time';
                s.incasso1 = x.incasso1;
                s.incasso2 = x.incasso2;
                s.media1 = x.media1;
                s.media2 = x.media2;
                s.passaggi1 = x.passaggi1;
                s.passaggi2 = x.passaggi2;
                s.produzione1 = x.produzione1;
                s.produzione2 = x.produzione2;
                s.spese1 = x.spese1;
                s.spese2 = x.spese2;
                s.nuoviClienti1 = x.nuoviClienti1;
                s.nuoviClienti2 = x.nuoviClienti2;
                s.clientiMovimentati1 = x.clientiMovimentati1;
                s.clientiMovimentati2 = x.clientiMovimentati2;
                s.annoCorrente = x.annoCorrente;
                s.annoPrecedente = x.annoPrecedente;
                s.logEventi = x.logEventi;
                s.attesa = false;

                s.ChartData = [
                  { data: [], label: this.anno1.toFixed() },
                  { data: [], label: this.anno2.toFixed() },
                ];

                s.ChartData[0].data = x.annoCorrente;
                s.ChartData[1].data = x.annoPrecedente;

                s.ChartClientiData = [
                  { data: [], label: 'Corrente' },
                ];

                if (s.aperto === 'show') {
                  this.getSaloneCompleto(s);
                }

                this.service.getClassiClienti(s).subscribe(x => {
                  //element.ChartClientiData[0].data = [];
                  //alert(JSON.stringify(element.ChartClientiData[0].data));
                  s.ChartClientiData[0].data.push(x[0].qta);
                  s.ChartClientiData[0].data.push(x[1].qta);
                  s.ChartClientiData[0].data.push(x[2].qta);
                  s.ChartClientiData[0].data.push(x[3].qta);
                  s.ChartClientiData[0].data.push(x[4].qta);
                  //alert(JSON.stringify(element.ChartClientiData[0].data));
                }, err => {
                  alert(err);
                });
                return false;
              }
            });

          }, (err) => {
            s.destinazione = 'Web';
            this.caricaBackup(s);
          });
     */
    this.caricaBackup(s);
  }

  caricaBackup(s: Salone) {
    s.destinazione = 'Web';
    this.service.getSalone(s, this.intervallo.data1, this.intervallo.data2).subscribe(
      x => {
        this.temps.forEach(element => {
          if ((element.salone === s.salone) && (element.porta === s.porta)) {
            element.posizione = 'Backup (' + element.ultimaSincronizzazione + ')';
            element.incasso1 = x.incasso1;
            element.incasso2 = x.incasso2;
            element.media1 = x.media1;
            element.media2 = x.media2;
            element.passaggi1 = x.passaggi1;
            element.passaggi2 = x.passaggi2;
            element.produzione1 = x.produzione1;
            element.produzione2 = x.produzione2;
            element.spese1 = x.spese1;
            element.spese2 = x.spese2;
            element.nuoviClienti1 = x.nuoviClienti1;
            element.nuoviClienti2 = x.nuoviClienti2;
            element.clientiMovimentati1 = x.clientiMovimentati1;
            element.clientiMovimentati2 = x.clientiMovimentati2;
            element.annoCorrente = x.annoCorrente;
            element.annoPrecedente = x.annoPrecedente;
            element.logEventi = x.logEventi;

            element.attesa = false;

            element.ChartData = [
              { data: [], label: this.anno1.toFixed() },
              { data: [], label: this.anno2.toFixed() },
            ];

            element.ChartData[0].data = x.annoCorrente;
            element.ChartData[1].data = x.annoPrecedente;

            element.ChartClientiData = [
              { data: [], label: 'Corrente' },
            ];

            if (s.aperto === 'show') {
              this.getSaloneCompleto(s);
            }

            this.service.getClassiClienti(s).subscribe(x => {
              element.ChartClientiData[0].data = [];
              element.ChartClientiData[0].data.push(x[0].importo);
              element.ChartClientiData[0].data.push(x[1].importo);
              element.ChartClientiData[0].data.push(x[2].importo);
              element.ChartClientiData[0].data.push(x[3].importo);
              element.ChartClientiData[0].data.push(x[4].importo);

            }, err => {
              alert(err);
            });
          }
        });
      }, (err) => {

      });
  }

  mostraAnagrafica(e: MouseEvent, idCliente: string) {
    this.router.navigate(['/cliente/' + idCliente]);
  }

  gestisciApertura(s: Salone) {
    s.aperto = s.aperto === 'show' ? '' : 'show'

    if (s.aperto === 'show') {
      s.classeAccordion = '';
    }
    if (s.aperto === 'show') {

      this.getSaloneCompleto(s);
    }
  }

  getSaloneCompleto(s: Salone) {
    s.attesa = true;

    this.service.getSaloneCompleto(s, this.intervallo.data1, this.intervallo.data2).subscribe(
      x => {
        s.attesa = false;

        this.temps.forEach(element => {
          if ((element.salone === s.salone) && (element.porta === s.porta)) {

            //element.posizione = 'Real time';
            element.incasso1 = x.incasso1;
            element.incasso2 = x.incasso2;
            element.media2 = x.media2;
            element.passaggi2 = x.passaggi2;
            element.produzione2 = x.produzione2;
            element.spese1 = x.spese1;
            element.spese2 = x.spese2;
            element.nuoviClienti1 = x.nuoviClienti1;
            element.nuoviClienti2 = x.nuoviClienti2;
            element.clientiMovimentati1 = x.clientiMovimentati1;
            element.clientiMovimentati2 = x.clientiMovimentati2;
          }
        });
      }, (err) => {
        alert('Server non raggiungibile');
      });

  }

  aggiornaDate() {
    this.sidenav.close();

    this.memorizzaDati();

    this.service.intervallo = this.intervallo;

    this.temps.forEach(element => {
      element.posizione = 'In attesa...'
      element.attesa = true;
      this.caricaSaloni(element);
    });
  }

  cambiaGiorno(direzione: string, tipo: string) {
    const a: string[] = this.menu.giorno.split('/');
    const d = Number.parseInt(a[0]);
    const m = Number.parseInt(a[1]) - 1;
    const y = Number.parseInt(a[2]);
    const data = new Date(y, m, d);

    if (direzione === 'Indietro') {
      if (tipo === 'Giorno') {
        this.menu.giorno = new Date(data.setDate(data.getDate() - 1)).toLocaleDateString();
      } else if (tipo === 'Settimana') {
        const aa: string[] = this.menu.settimana.data1.split('/');
        const dd = Number.parseInt(aa[0]);
        const mm = Number.parseInt(aa[1]) - 1;
        const yy = Number.parseInt(aa[2]);
        const data1 = new Date(yy, mm, dd);

        const lun = new Date(data1.setDate(data1.getDate() - 7));
        this.menu.settimana.data1 = lun.toLocaleDateString();

        const dom = new Date(lun.setDate(lun.getDate() + 6));
        this.menu.settimana.data2 = dom.toLocaleDateString();

      } else if (tipo === 'Mese') {
        const aa: string[] = this.menu.mese.data1.split('/');
        const dd = Number.parseInt(aa[0]);
        const mm = Number.parseInt(aa[1]) - 1;
        const yy = Number.parseInt(aa[2]);
        const data1 = new Date(yy, mm, dd);

        const prec = new Date(data1.setDate(data1.getDate() - 2));

        const primo = new Date(prec.getFullYear(), prec.getMonth(), 1);
        this.menu.mese.data1 = primo.toLocaleDateString();

        let ultimo = new Date(prec.getFullYear(), prec.getMonth(), this.getLstDayOfMon(primo));

        this.menu.mese.data2 = ultimo.toLocaleDateString();

      } else if (tipo === 'Anno') {
        this.anno1 = this.anno1 - 1;
        this.anno2 = this.anno2 - 1;
        this.menu.anno.data1 = '01/01/' + this.anno1;
        this.menu.anno.data2 = '31/12/' + this.anno1;

      } else if (tipo === 'Dieci') {

        const a: string[] = this.menu.dieci.data1.split('/');
        const d = Number.parseInt(a[0]);
        const m = Number.parseInt(a[1]) - 1;
        const y = Number.parseInt(a[2]);
        const data = new Date(y, m, d);
        let incremento: number = 10;
        if (data.getDate() === 31) {
          incremento = 12;
        } else if (data.getDate() === 21) {
          incremento = 9;
        }
        const prec = new Date(data.setDate(data.getDate() - incremento));

        this.menu.dieci = this.service.getDieci(prec);

      }
    } else if (direzione === 'Avanti') {
      if (tipo === 'Giorno') {
        const ddd: Date = new Date();

        if (data < new Date(ddd.getFullYear(), ddd.getMonth(), ddd.getDate())) {
          this.menu.giorno = new Date(data.setDate(data.getDate() + 1)).toLocaleDateString();
        }
      } else if (tipo === 'Settimana') {
        const aa: string[] = this.menu.settimana.data1.split('/');
        const dd = Number.parseInt(aa[0]);
        const mm = Number.parseInt(aa[1]) - 1;
        const yy = Number.parseInt(aa[2]);
        const data1 = new Date(yy, mm, dd);
        const lun = new Date(data1.setDate(data1.getDate() + 7));
        this.menu.settimana.data1 = lun.toLocaleDateString();
        let dom = new Date(lun.setDate(lun.getDate() + 6));
        if (dom > new Date()) {
          this.menu.settimana = this.service.settimanaCorrente();
        } else {
          this.menu.settimana.data2 = dom.toLocaleDateString();
        }

      } else if (tipo === 'Mese') {
        const aa: string[] = this.menu.mese.data1.split('/');
        const dd = Number.parseInt(aa[0]);
        const mm = Number.parseInt(aa[1]) - 1;
        const yy = Number.parseInt(aa[2]);
        const data1 = new Date(yy, mm, dd);
        const prec = new Date(data1.setDate(data1.getDate() + 32));

        const primo = new Date(prec.getFullYear(), prec.getMonth(), 1);

        this.menu.mese.data1 = primo.toLocaleDateString();

        let ultimo = new Date(prec.getFullYear(), prec.getMonth(), this.getLstDayOfMon(primo));

        if (ultimo > new Date()) {
          this.menu.mese = this.service.meseCorrente();
        } else {
          this.menu.mese.data2 = ultimo.toLocaleDateString();
        }

      } else if (tipo === 'Anno') {
        if (this.anno1 < new Date().getFullYear()) {
          this.anno1 = this.anno1 + 1;
          this.anno2 = this.anno2 + 1;
          this.menu.anno.data1 = '01/01/' + this.anno1;
          this.menu.anno.data2 = '31/12/' + this.anno1;
          if (this.anno1 >= new Date().getFullYear()) {
            this.anno1 = new Date().getFullYear();
            this.anno2 = this.anno1 - 1;
            this.menu.anno.data1 = '01/01/' + this.anno1;
            this.menu.anno.data2 = new Date().toLocaleDateString();
          }
        }
      } else if (tipo === 'Dieci') {

        const a: string[] = this.menu.dieci.data1.split('/');
        const d = Number.parseInt(a[0]);
        const m = Number.parseInt(a[1]) - 1;
        const y = Number.parseInt(a[2]);
        const data = new Date(y, m, d);
        const prec = new Date(data.setDate(data.getDate() + 12));

        this.menu.dieci = this.service.getDieci(prec);
      }
    }
  }

  getLstDayOfMon(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  setDate(tipo: string) {
    if (tipo === 'Giorno') {
      this.intervallo.data1 = this.menu.giorno;
      this.intervallo.data2 = this.menu.giorno;
      this.intervallo.codice = 'Giorno';
      this.intervallo.name = this.menu.giorno;
    } else if (tipo === 'Settimana') {
      this.intervallo.data1 = this.menu.settimana.data1;
      this.intervallo.data2 = this.menu.settimana.data2;
      this.intervallo.codice = 'Settimana';
      this.intervallo.name = 'Settimana: ' + this.menu.settimana.data1 + ' - ' + this.menu.settimana.data2;
    } else if (tipo === 'Mese') {
      this.intervallo.data1 = this.menu.mese.data1;
      this.intervallo.data2 = this.menu.mese.data2;
      this.intervallo.codice = 'Mese';
      this.intervallo.name = 'Mese: ' + this.menu.mese.data1 + ' - ' + this.menu.mese.data2;
    } else if (tipo === 'Anno') {

      this.intervallo.data1 = this.menu.anno.data1;
      this.intervallo.data2 = this.menu.anno.data2;
      this.intervallo.codice = 'Anno';
      this.intervallo.name = 'Anno: ' + this.anno1;
    } else if (tipo === 'Dieci') {
      this.intervallo.data1 = this.menu.dieci.data1;
      this.intervallo.data2 = this.menu.dieci.data2;
      this.intervallo.codice = 'Dieci';
      this.intervallo.name = '10gg: ' + this.menu.dieci.data1 + ' - ' + this.menu.dieci.data2;
    }
    localStorage.setItem('DataImpostazioneIntervallo', JSON.stringify(new Date()));
    this.aggiornaDate();
  }

  giornoDelMese(d: string): string {
    const a: string[] = d.split('/');
    return a[0];
  }

  openStatistiche(s: Salone, Statistica: string) {
    s.aperto = 'show';

    this.service.intervallo = this.intervallo;
    this.service.saloneCorrente = s;
    this.service.saloni = this.temps;
    localStorage.setItem('Intervallo', JSON.stringify(this.intervallo));
    localStorage.setItem('PlannerCorrente', s.gruppo + ';' + s.salone + ';' + s.destinazione + ';' + s.indirizzoIP + ';' + s.porta + ';' + s.posizionePlanner);
    localStorage.setItem('OpzioniPlanner', JSON.stringify(s.opzioniPlanner));
    localStorage.setItem('Gruppo', s.gruppo);
    localStorage.setItem('Salone', s.salone);

    var el = document.querySelector('#divToScroll');
    sessionStorage.setItem("Scroll", el.scrollTop.toString());

    if (Statistica === 'Collaboratori') {
      sessionStorage.setItem('Collaboratori', '');
      this.router.navigate(['collaboratori']);
    } else if (Statistica === 'Clienti movimentati') {
    } else if (Statistica === 'Passaggi') {
      this.router.navigate(['passaggi']);
    } else if (Statistica === 'Produzione') {
      this.router.navigate(['produzione']);
    } else if (Statistica === 'Spese') {
      this.router.navigate(['spese']);
    } else if (Statistica === 'Nuovi clienti') {
      this.router.navigate(['nuoviClienti']);
    } else if (Statistica === 'Incasso') {
      this.router.navigate(['incasso']);
    } else if (Statistica === 'FuoriFrequenza') {
      this.router.navigate(['fuorifrequenza']);
    } else if (Statistica === 'ParcoClienti') {
      this.router.navigate(['parcoclienti']);
    } else if (Statistica === 'ClientiInSalone') {
      //this.router.navigate(['clientiinsalone']);
      this.showInSala(s);
    } else if (Statistica === 'Stecchiti') {
      this.router.navigate(['stecchiti']);
    } else if (Statistica === 'Appuntamenti') {
      console.log('salone')
      console.log(s)
      this.router.navigateByUrl('planner');
    }
  }

  showInSala(s: Salone) {
    this.serviceRT.getInSala(s).subscribe((x: TempFiche[]) => {
      const dialogRef = this.dialog.open(InAttesaComponent, {
        width: '95%',
        maxWidth: '350px',
        data: x
      });
      //this.router.navigate(['insalaoggi']);
    }
    );
  }
  mostraLogEventi(s: Salone) {
    const dialogRef = this.dialog.open(LogEventiComponent, {
      maxWidth: '100vw !important',
      maxHeight: '100vw !important',
      data: s
    });
  }

  receiveMessage($event) {
    this.intervallo.data1 = $event.data1;
    this.intervallo.data2 = $event.data2;
    this.intervallo.name = 'dal ' + this.intervallo.data1 + ' al ' + this.intervallo.data2;

    this.aggiornaDate();
  }

  logOut() {
    this.auth.logOut();
  }

  generaIndirizzoPlanner(t: Salone) {
    this.router.navigate(['qrcode'], { state: { example: t.indirizzoPlanner } });
  }

  back() {
    //this.router.navigate(['super/' + localStorage.getItem('Consulente')]);
    this.loc.back();
  }

}
