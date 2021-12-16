import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from 'angular-notifier';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';
import { Salone } from 'src/app/Models/Salone';
import { SaloniService } from 'src/app/Services/saloni.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectComponent } from '../share/select/select.component';
import { MsgboxComponent } from '../share/msgbox/msgbox.component';
import { SelectionModel } from '@angular/cdk/collections';
import { RealTime } from 'src/app/Models/RealTime';
import { RealtimeService } from 'src/app/Services/realtime.service';
import { LogEventiComponent } from '../log-eventi/log-eventi.component';
import { LogEvento } from 'src/app/Models/LogEvento';
import { Pagamento } from 'src/app/Models/Pagamento';
import { IncassiComponent } from '../incassi/incassi.component';
import { TempFiche } from 'src/app/Models/Temp-Fiche';
import { InAttesaComponent } from '../in-attesa/in-attesa.component';
import { Passaggio } from 'src/app/Models/Passaggio';
import { PassaggiCassaComponent } from '../passaggi-cassa/passaggi-cassa.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tempoReale',
  templateUrl: './tempoReale.component.html',
  styleUrls: ['./tempoReale.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TempoRealeComponent implements OnInit, AfterViewInit {
  columnsToDisplay = ['select', 'salone', 'incasso', 'passaggi', 'inSala', 'logEventi'];
  dataSource = new MatTableDataSource<RealTime>([]);
  expandedElement: RealTime | null;
  selection = new SelectionModel<RealTime>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: RealTime): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${1}`;
  }

  realTime: RealTime[] = [];
  gruppo: string = '';


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
  }

  constructor(private aRoute: ActivatedRoute, private router: Router, private auth: AuthService, private service: SaloniService, private serviceRT: RealtimeService, private notifier: NotifierService, pag: MatPaginatorIntl, public dialog: MatDialog,) {
    pag.itemsPerPageLabel = '-';
  }
  ngOnInit() {
    this.gruppo = localStorage.getItem('GruppoSaloni');
    this.aggiornaLista(this.gruppo);
  }

  aggiornaLista(gruppo: string) {
    localStorage.removeItem('ModalitaConsulente');
    this.service.getSaloni(gruppo).subscribe(x => {

      this.realTime = [];
      x.forEach(s => {
        this.serviceRT.getRealTime(s).subscribe((rt: RealTime) => {
          rt.salone = s;
          this.realTime.push(rt);
          this.realTime= this.realTime.sort((a,b)=>a.salone.salone.localeCompare(b.salone.salone));
          this.dataSource = new MatTableDataSource<RealTime>(this.realTime);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource._updateChangeSubscription();

        });
      });
      this.notifier.notify('success', 'Saloni attivi: ' + x.length);
    }, (err => {
      this.notifier.notify('warning', 'Errore nella connessione al server');
    })
    );

  }

  logout() {
    this.auth.logOut();
  }

  showSalone(s: Salone) {
    localStorage.setItem('Consulente', this.gruppo);
    localStorage.setItem('ModalitaConsulente', 'true');

    localStorage.setItem('GruppoSaloni', s.gruppo);
    s.posizione = 'Web';
    localStorage.setItem('SaloniConsulente', JSON.stringify([s]));
    this.router.navigate(['/saloni']);
  }

  showSaloni() {
    localStorage.setItem('Consulente', this.gruppo);
    localStorage.setItem('ModalitaConsulente', 'true');
    let saloni: Salone[] = [];
    this.selection.selected.forEach(x => {
      x.salone.posizione = 'Web';
      saloni.push(x.salone);
    });
    localStorage.setItem('SaloniConsulente', JSON.stringify(saloni));
    this.router.navigate(['/saloni']);
  }

  apriDettagli(s: RealTime) {
    this.expandedElement = this.expandedElement === s ? null : s;
    if (this.expandedElement === s) {
      this.service.getAnagraficaSolone(s.salone).subscribe(x => {
        s.salone.ragioneSociale = x.ragioneSociale;
        s.salone.indirizzo = x.indirizzo;
        s.salone.cap = x.cap;
        s.salone.paese = x.paese;
        s.salone.provincia = x.provincia;
        s.salone.tel = x.tel;
        s.salone.cell = x.cell;
        s.salone.email = x.email;

        const anno: number = Number.parseInt(String(x.dataAttivazione).substr(0, 4)) + 1;
        const mese: number = Number.parseInt(String(x.dataAttivazione).substr(5, 2)) - 1;
        const giorno: number = Number.parseInt(String(x.dataAttivazione).substr(8, 2));
        x.dataAttivazione = new Date(anno, mese, giorno);

        s.salone.dataAttivazione = x.dataAttivazione;
      }), (err => {
        this.notifier.notify('warning', 'Errore nella connessione al server');
      });

    }
  }

  showSel() {
    this.showSaloni();
  }

  showIncasso(s: Salone) {
    this.serviceRT.getIncassi(s).subscribe((x: Pagamento[]) => {
      const dialogRef = this.dialog.open(IncassiComponent, {
        minWidth: '90% !important',
        maxHeight: '100vw !important',
        data: x
      });
      //this.router.navigate(['incassodelgiorno']);
    }
    );
  }
  showInSala(s: Salone) {
    this.serviceRT.getInSala(s).subscribe((x: TempFiche[]) => {
      const dialogRef = this.dialog.open(InAttesaComponent, {
        maxWidth: '100vw !important',
        maxHeight: '100vw !important',
        data: x
      });
      //this.router.navigate(['insalaoggi']);
    }
    );
  }
  showLogEventi(s: Salone) {
    this.serviceRT.getLogEventi(s).subscribe((x: LogEvento[]) => {
      s.logEventi = x;
      const dialogRef = this.dialog.open(LogEventiComponent, {
        maxWidth: '100vw !important',
        maxHeight: '100vw !important',
        data: s
      });
    }
    );
  }
  showPassaggi(s: Salone) {
    this.serviceRT.getPassaggi(s).subscribe((x: Passaggio[]) => {
      const dialogRef = this.dialog.open(PassaggiCassaComponent, {
        maxWidth: '100vw !important',
        maxHeight: '100vw !important',
        data: x
      });
      //this.router.navigate(['passaggidelgiorno']);

    }
    );
  }
  back() {
    this.router.navigate(['/saloni']);
    localStorage.setItem('Consulente', '');
    localStorage.setItem('ModalitaConsulente', '');
  }

}
