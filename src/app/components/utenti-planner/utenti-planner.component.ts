import { Component, OnInit, ViewChild } from '@angular/core';
import { Salone } from 'src/app/Models/Salone';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { ClasseClienti } from 'src/app/Models/ClasseClienti';
import { Intervallo } from 'src/app/Models/Intervallo';
import { FormControl, FormGroup } from '@angular/forms';
import { Cliente } from 'src/app/Models/Cliente';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientiService } from 'src/app/Services/clienti.service';
import { MatDialog } from '@angular/material/dialog';
import { DettagliClienteComponent } from '../dettagli-cliente/dettagli-cliente.component';
import { PlannerService } from 'src/app/Services/planner.service';
import { MsgboxComponent } from '../share/msgbox/msgbox.component';

@Component({
  selector: 'app-utenti-planner',
  templateUrl: './utenti-planner.component.html',
  styleUrls: ['./utenti-planner.component.scss']
})
export class UtentiPlannerComponent implements OnInit {
  columnsToDisplay = ['bloccato', 'prenotazioniMultiple', 'nome', 'cognome', 'cell', 'email', 'password','confermato'];
  dataSource = new MatTableDataSource<Cliente>([]);
  clienti: Cliente[] = [];
  public searchForm: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  title = '';
  salone: Salone;
  temps: ClasseClienti[];
  totaleClienti: number = 0;

  intervallo: Intervallo;
  anno1: string;
  anno2: string;



  attesa: boolean = true;

  constructor(private router: Router, private plannerSer: PlannerService, private saloneService: SaloniService, private loc: Location, private notifier: NotifierService, private service: ClientiService, pag: MatPaginatorIntl, public dialog: MatDialog) {
    pag.itemsPerPageLabel = '-';
  }


  ngOnInit(): void {
    this.salone = this.saloneService.saloneCorrente;

    if (!this.salone) {
      const a: string[] = localStorage.getItem('PlannerCorrente').split(';');
      this.salone = new Salone();
      this.salone.gruppo = a[0];
      this.salone.salone = a[1];
      this.salone.destinazione = a[2];
      this.salone.indirizzo = a[3];
      this.salone.porta = a[4];
      this.salone.posizionePlanner = a[5];
    }
    this.searchForm = new FormGroup({
      srcCliente: new FormControl(''),
      srcPaese: new FormControl(''),
    });
    this.aggiornaListaClienti('');
  }

  aggiornaListaClienti(txt: string) {
    this.plannerSer.getUtentiPlanner(this.salone, txt).subscribe(x => {
      this.clienti = x;
      this.dataSource = new MatTableDataSource<Cliente>(this.clienti);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource._updateChangeSubscription();
      console.log(x);
    }, err => {
      console.log(err);
      this.notifier.notify('warning', 'Errore nella connessione al server');
    }
    );
  }

  cleatTxt(campo: string) {
    if (campo === 'srcCliente') {
      this.searchForm.get('srcCliente').reset('');
    } else {
      if (campo === 'srcPaese') {
        this.searchForm.get('srcPaese').reset('');
      }
    }
    this.aggiornaListaClienti('');
  }

  apriDettagliCliente(element: Cliente) {
    console.log(element);
    console.log(this.salone);
    this.plannerSer.getUtentePlanner(this.salone, element.id).subscribe(x => {
      let app = { s: this.salone, c: x };
      console.log(x);
      const dialogRef = this.dialog.open(DettagliClienteComponent, {
        minWidth: '100vw !important',
        minHeight: '100vw !important',
        data: app
      });
    }, (err => {
      this.attesa = false;
      console.log(err);
      this.notifier.notify('warning', 'Errore nella connessione al server');
    }));
  }

  searchClienti(txt: string) {
    if (txt.length > 2) {
      this.aggiornaListaClienti(txt);
    } else {
      if (txt.length === 0) {
        this.aggiornaListaClienti('');
      }
    }
  }

  aggiornaBlocco(element: Cliente) {
    let testo: string = 'Bloccare l\'utente selezionato?';
    if (element.bloccato) {
      testo = 'Sbloccare l\'utente selezionato?';
    }
    const dialogRef = this.dialog.open(MsgboxComponent, {
      minWidth: '100vw !important',
      minHeight: '100vw !important',
      data: testo
    });
    dialogRef.afterClosed().subscribe(s => {
      if (s) {
        element.bloccato = !element.bloccato;
        this.plannerSer.updateUtentePlanner(element).subscribe(x => {
          if (x.esito === 'true') {
          } else {

            element.bloccato = !element.bloccato;
          }
        }, err => {
          element.bloccato = !element.bloccato;
          console.log(err);
        });
      }
    });


  }

  aggiornaPrenotazioniMultiple(element: Cliente) {
    const dialogRef = this.dialog.open(MsgboxComponent, {
      minWidth: '100vw !important',
      minHeight: '100vw !important',
      data: 'Aggiornare le prenotazioni multiple?'
    });
    dialogRef.afterClosed().subscribe(s => {
      if (s) {
        element.prenotazioniMultiple = !element.prenotazioniMultiple;
        this.plannerSer.updateUtentePlanner(element).subscribe(x => {
          if (x.esito === 'true') {
          } else {

            element.prenotazioniMultiple = !element.prenotazioniMultiple;
          }
        }, err => {
          element.prenotazioniMultiple = !element.prenotazioniMultiple;
          console.log(err);
        });
      }
    });
  }

  aggiornaConfermato(element: Cliente) {
    const dialogRef = this.dialog.open(MsgboxComponent, {
      minWidth: '100vw !important',
      minHeight: '100vw !important',
      data: 'Aggiornare la conferma?'
    });
    dialogRef.afterClosed().subscribe(s => {
      if (s) {
        element.prenotazioniMultiple = !element.prenotazioniMultiple;
        this.plannerSer.updateUtentePlanner(element).subscribe(x => {
          if (x.esito === 'true') {
          } else {
            element.confermato = !element.confermato;
          }
        }, err => {
          element.confermato = !element.confermato;
          console.log(err);
        });
      }
    });
  }


  back() {
    this.loc.back();
  }

}
