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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prova',
  templateUrl: './prova.component.html',
  styleUrls: ['./prova.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProvaComponent  implements OnInit, AfterViewInit {
  columnsToDisplay = ['gruppo','salone','ultimaSincronizzazione', 'actions'];
  dataSource = new MatTableDataSource<Salone>([]);
  expandedElement: Salone | null;

  public searchForm: FormGroup;

  consulente:string='';
  prodotti: string[] = [];
  prodottoSelezionato: string = '';
  comuni: string[] = [];
  paese: string = '';
  ragioneSoc: string = '';


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
  }

  constructor(private aRoute: ActivatedRoute, private auth:AuthService, private service: SaloniService, private notifier: NotifierService, pag: MatPaginatorIntl, public dialog: MatDialog,) {
    pag.itemsPerPageLabel = '-';
    this.consulente= this.aRoute.snapshot.paramMap.get('id');
  }
  ngOnInit() {
    this.aggiornaLista(this.prodottoSelezionato, this.ragioneSoc, this.paese);
    this.searchForm = new FormGroup({
      prodotto: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      ragioneSociale: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      comune1: new FormControl('')
    });
  }

  aggiornaLista(prodotto: string, ragioneSoc: string, paese: string) {
    this.service.getSaloniConsulente(this.consulente).subscribe(x => {
      this.dataSource = new MatTableDataSource<Salone>(x);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource._updateChangeSubscription();
      if (ragioneSoc === '' && paese === '') {
        this.notifier.notify('success', 'Licenze trovate: ' + x.length);
      }
    }, (err => {
      this.notifier.notify('warning', 'Errore nella connessione al server');
    })
    );

  }

  search() {
    const paese = this.searchForm.get('comune1').value;
    const ragioneSoc = this.searchForm.get('ragioneSociale').value;
    const prodotto = this.searchForm.get('prodotto').value;

    this.aggiornaLista(prodotto, ragioneSoc, paese);
  }

  cleatTxt(campo: string) {
    if (campo === 'ragioneSoc') {
      this.searchForm.get('ragioneSociale').reset('');
    } else if (campo === 'paese') {
      this.searchForm.get('comune1').reset('');
    }
    this.search();
  }

  logout(){
    this.auth.logOut();
  }
}

