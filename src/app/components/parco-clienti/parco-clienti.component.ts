import { Component, OnInit, ViewChild } from '@angular/core';
import { Salone } from 'src/app/Models/Salone';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
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

@Component({
  selector: 'app-parco-clienti',
  templateUrl: './parco-clienti.component.html',
  styleUrls: ['./parco-clienti.component.scss']
})
export class ParcoClientiComponent implements OnInit {
  columnsToDisplay = ['classe', 'nome', 'cognome', 'cell', 'paese'];
  dataSource = new MatTableDataSource<Cliente>([]);
  clienti: Cliente[] = [];
  flagCercaServizi = false;
  mostraTabella = false;
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

  constructor(private router: Router, private saloneService: SaloniService,
    private loc: Location,
    private notifier: NotifierService,
    private service: ClientiService,
    pag: MatPaginatorIntl,
    public dialog: MatDialog)
  {
    pag.itemsPerPageLabel = '-';
  }

  memorizzaDati() {
    localStorage.setItem("SaloneCorrente", JSON.stringify(this.salone));
  }

  ngOnInit() {
    this.salone = this.saloneService.saloneCorrente;

    if (this.salone) {
      this.memorizzaDati();
    } else {
      this.intervallo = JSON.parse(localStorage.getItem("Intervallo"));
      this.salone = JSON.parse(localStorage.getItem("SaloneCorrente"));
    }

    this.aggiornaClassi();

    this.intervallo = this.saloneService.intervallo;
    this.searchForm = new FormGroup({
      srcCliente: new FormControl(''),
    });

  }

  aggiornaListaClienti(txt: string) {
    this.service.getClientiDelSalone(this.salone, txt).subscribe(x => {
      this.clienti = x;
      this.dataSource = new MatTableDataSource<Cliente>(this.clienti);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource._updateChangeSubscription();
    }, err => {
      console.log(err);
      this.notifier.notify('warning', 'Errore nella connessione al server');
    }
    );
  }

  aggiornaClassi() {
    this.barChartLabels = [];
    this.barChartData[0].data = []

    this.saloneService.getClassiClienti(this.salone).subscribe(
      x => {
        this.temps = x;
        this.attesa = false;
        this.totaleClienti = 0;
        this.barChartData[0].data = [];
        this.barChartLabels = [];

        this.barChartDataSottoClasse[0].data = [];
        this.barChartLabelsSottoClasse = [];

        this.temps.forEach(y => {
          if (y.classe !== 'Inattivi' && y.classe !== 'Persi') {
            this.totaleClienti = this.totaleClienti + y.qta;
          } else {
            y.sottoClasse.forEach(z => {
              this.barChartDataSottoClasse[0].data.push(z.qta);
              this.barChartLabelsSottoClasse.push(z.classe);
            });
          }
          this.barChartData[0].data.push(y.qta);
          this.barChartLabels.push(y.classe);
        })
      }, (err => {
        this.attesa = false;
        this.notifier.notify('warning', 'Errore nella connessione al server');
      })
    );
  }


  back() {
    this.loc.back();
  }

  replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
  }


  barChartOptions: ChartOptions = this.createOptions();
  barChartLabels: Label[] = ['A', 'B', 'C', 'D', 'Inattivi'];
  barChartLabelsSottoClasse: Label[] = ['A', 'B', 'C', 'D'];
  barChartDataSottoClasse: ChartDataSets[] = [{ data: [45, 37, 60, 70], label: 'Classi clienti Persi' }];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [{ data: [45, 37, 60, 70, 46], label: 'Parco Clienti' }];


  private createOptions(): ChartOptions {
    return {
      responsive: true,
      legend: {
        position: 'top'
      },
      hover: {
        animationDuration: 0
      },
      animation: {
        duration: 1,
        onComplete: function () {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              var data = dataset.data[index];
              ctx.fillText(data, bar._model.x, bar._model.y - 5);
            });
          });
        }
      }
    };
  }

  setFlagCercaServizi() {
    this.flagCercaServizi = !this.flagCercaServizi;
    if (!this.flagCercaServizi) {
      this.mostraTabella = false;
    }
  }

  searchClienti(txt: string) {
    if (txt.length > 2) {
      this.aggiornaListaClienti(txt);
      this.mostraTabella = true;
    }
  }

  cleatTxt(campo: string) {
    if (campo === 'srcCliente') {
      this.searchForm.get('srcCliente').reset('');
    }
    this.mostraTabella = false;
  }

  apriDettagliCliente(element: Cliente) {
    console.log(element);
    console.log(this.salone);
    this.service.getClienteDelSalone(this.salone, element.id).subscribe(x => {
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
}
