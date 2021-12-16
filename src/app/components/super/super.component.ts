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

@Component({
  selector: 'app-super',
  templateUrl: './super.component.html',
  styleUrls: ['./super.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SuperComponent implements OnInit, AfterViewInit {
  columnsToDisplay = ['select', 'gruppo', 'salone', 'idArea', 'ultimaSincronizzazione', 'actions'];
  dataSource = new MatTableDataSource<Salone>([]);
  expandedElement: Salone | null;
  selection = new SelectionModel<Salone>(true, []);

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
  checkboxLabel(row?: Salone): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${1}`;
  }


  public searchForm: FormGroup;

  consulente: string = '';
  aree: string[] = [];
  areaSelezionata: string = '';
  gruppo: string = '';
  salone: string = '';


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
  }

  constructor(private aRoute: ActivatedRoute, private router: Router, private auth: AuthService, private service: SaloniService, private notifier: NotifierService, pag: MatPaginatorIntl, public dialog: MatDialog,) {
    pag.itemsPerPageLabel = '-';
    this.consulente = this.aRoute.snapshot.paramMap.get('id');
  }
  ngOnInit() {
    this.aggiornaLista(this.areaSelezionata, this.gruppo, this.salone);
    this.searchForm = new FormGroup({
      gruppo: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      salone: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      area: new FormControl('')
    });

    this.service.getAreeConsulente(this.consulente).subscribe(x => {
      this.aree = x;
    });

  }

  aggiornaLista(area: string, gruppo: string, salone: string) {
    this.service.getSaloniConsulenteFiltrati(this.consulente, area, gruppo, salone).subscribe(x => {
      this.dataSource = new MatTableDataSource<Salone>(x);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource._updateChangeSubscription();
      if (gruppo === '' && salone === '') {
        this.notifier.notify('success', 'Licenze trovate: ' + x.length);
      }
    }, (err => {
      this.notifier.notify('warning', 'Errore nella connessione al server');
    })
    );

  }

  search() {
    const salone = this.searchForm.get('salone').value;
    const gruppo = this.searchForm.get('gruppo').value;
    const area = this.searchForm.get('area').value;

    this.aggiornaLista(area, gruppo, salone);
  }

  cleatTxt(campo: string) {
    if (campo === 'gruppo') {
      this.searchForm.get('gruppo').reset('');
    } else if (campo === 'salone') {
      this.searchForm.get('salone').reset('');
    }
    this.search();
  }

  modify(s: Salone) {
    let titoli = [
      { value: '0', label: '' }
    ];

    this.aree.forEach(x => {
      titoli.push({ value: x, label: x });
    });
    const dialogRef = this.dialog.open(SelectComponent, {
      width: '650px',
      data: titoli
    });

    dialogRef.afterClosed().subscribe(x => {
      if (x) {
        if (x.label === 'Nuova') {
          this.aree.push(x.value);
        }
        let newS: Salone = Object.assign({}, s);

        newS.idArea = x.value;
        this.service.updateMyIp(newS).subscribe(ris => {
          if (ris) {
            this.dataSource.data.forEach(i => {
              if (i.id === s.id) {
                i.idArea = x.value;
                this.dataSource._updateChangeSubscription;
                this.notifier.notify('success', 'Licenza aggiornata');
              }
            });
          } else {
            this.notifier.notify('warning', ris);
          }

        }, (err => {
          this.notifier.notify('warning', 'Errore nella connessione al server');
        }));
      }
    });
  }

  delete(e: Salone) {
    const dialogRef = this.dialog.open(MsgboxComponent, {
      width: '250px',
      data: 'Escludere la licenza di ' + e.salone + '?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        let newS: Salone = Object.assign({}, e);

        newS.consulente = '';

        this.service.updateMyIp(newS).subscribe(ris => {
          if (ris === 'true') {

            let index = this.dataSource.data.findIndex(d => d.id === e.id); //find index in your array
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription();
            this.notifier.notify('success', 'Licenza esclusa');
          } else {
            this.notifier.notify('warning', 'Il server non è riuscito ad escludere la licenza. ');
          }
        }, (err => {
          this.notifier.notify('warning', 'Errore nella connessione al server');
        }));
      }
    });

  }
  logout() {
    this.auth.logOut();
  }

  showSalone(s: Salone) {
    localStorage.setItem('GruppoSaloni', s.gruppo);
    s.posizione = 'Web';
    localStorage.setItem('SaloniConsulente', JSON.stringify([s]));
    this.router.navigate(['/saloni']);
  }

  showSaloni() {
    let saloni: Salone[] = [];
    this.selection.selected.forEach(x => {
      x.posizione = 'Web';
      saloni.push(x);
    });
    localStorage.setItem('GruppoSaloni', this.consulente);
    localStorage.setItem('SaloniConsulente', JSON.stringify(saloni));
    /* localStorage.setItem('SaloneCorrente','');
     localStorage.setItem('SaloneCorrente','');
     this.service.saloni=[]; */
    this.router.navigate(['/saloni']);
  }

  apriDettagli(s: Salone) {
    this.expandedElement = this.expandedElement === s ? null : s;
    if (this.expandedElement === s) {
      this.service.getAnagraficaSolone(s).subscribe(x => {
        s.ragioneSociale = x.ragioneSociale;
        s.indirizzo = x.indirizzo;
        s.cap = x.cap;
        s.paese = x.paese;
        s.provincia = x.provincia;
        s.tel = x.tel;
        s.cell = x.cell;
        s.email = x.email;

        const anno: number = Number.parseInt(String(x.dataAttivazione).substr(0, 4)) + 1;
        const mese: number = Number.parseInt(String(x.dataAttivazione).substr(5, 2)) - 1;
        const giorno: number = Number.parseInt(String(x.dataAttivazione).substr(8, 2));
        x.dataAttivazione = new Date(anno, mese, giorno);

        s.dataAttivazione = x.dataAttivazione;
      }), (err => {
        this.notifier.notify('warning', 'Errore nella connessione al server');
      });

    }
  }

  showSel() {
    this.showSaloni();
  }
}
