import { Component, OnInit, ViewChild } from '@angular/core';
import { Salone } from 'src/app/Models/Salone';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { Spesa } from 'src/app/Models/Spesa';
import { SpesaGruppo } from 'src/app/Models/SpesaGruppo';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { MatSidenav } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { Intervallo } from 'src/app/Models/Intervallo';
import { NuovaSpesaComponent } from './nuova-spesa/nuova-spesa.component';
import { MatDialog } from '@angular/material/dialog';
import { SpeseService } from 'src/app/Services/spese.service';

@Component({
  selector: 'app-spese',
  templateUrl: './spese.component.html',
  styleUrls: ['./spese.component.scss']
})
export class SpeseComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  salone: Salone;
  speseSql:Spesa[]=[];

  Intervalli: any;
  anno1: number;
  anno2: number;

  title = '';

  intervallo: Intervallo;
  temps: SpesaGruppo[];
  totaleSpese: number = 0;

  attesa: boolean = true;

  constructor(private router: Router, private saloneService: SaloniService, private loc: Location,
    private notifier: NotifierService, public dialog: MatDialog, private speseService: SpeseService) {

  }

  ngOnInit() {
    this.salone = this.saloneService.saloneCorrente;
    this.intervallo = JSON.parse(localStorage.getItem('Intervallo'));
    this.anno1 = Number.parseInt(this.intervallo.data2.substr(this.intervallo.data2.length - 4));
    this.anno2 = this.anno1 - 1;

    if (this.salone) {
    } else {
      this.salone = JSON.parse(localStorage.getItem("SaloneCorrente"));
    }

    if (this.salone === null) {
      this.salone = new Salone();
      this.salone.gruppo = localStorage.getItem('Gruppo');
      this.salone.salone = localStorage.getItem('Salone');
      this.salone.destinazione = 'web';
    }
    this.aggiornaSpese();

  }

  aggiornaSpese() {
    this.barChartLabels = [];
    this.barChartData[0].data = []

    this.saloneService.getSpese(this.salone, this.intervallo.data1, this.intervallo.data2).subscribe(
      x => {
        this.temps = x;
        this.attesa = false;
        this.totaleSpese = 0;
        this.temps.forEach(y => {
          this.totaleSpese = this.totaleSpese + y.importo;
          this.barChartLabels.push(y.descrizione);
          this.barChartData[0].data.push(y.importo);
        })
      }, (err => {
        this.attesa = false;
        this.notifier.notify('warning', 'Errore nella connessione al server');
      })
    );
    this.aggiornaSpeseSql();
  }

  back() {
    this.loc.back();
  }

  replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
  }

  barChartOptions: ChartOptions = this.createOptions();
  barChartLabels: Label[] = ['1', '2', '3', '4', '5', '6'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [{ data: [45, 37, 60, 70, 46, 33], label: 'Spese' }];


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

  receiveMessage($event) {
    this.intervallo.data1 = $event.data1;
    this.intervallo.data2 = $event.data2;
    this.attesa = true;
    this.aggiornaSpese();
  }

  aggiornaSpeseSql() {
    this.speseService.getSpese(this.salone, this.intervallo.data1, this.intervallo.data2).subscribe(x => {
      this.speseSql=x;
    }, err => {
      console.log(err);
    });
  }

  nuovaSpesa() {
    const dialogRef = this.dialog.open(NuovaSpesaComponent, {
      width: '95%',
      maxWidth: '350px',
      data: new Spesa(),
    });

    dialogRef.afterClosed().subscribe(s => {
      if (s) {
        this.speseService.addSpesa(this.salone, s).subscribe(x => {
          s = x;
          this.notifier.notify('success', 'Spesa aggiunta con successo');
          this.aggiornaSpeseSql();
        }, (err) => {
          this.notifier.notify('warning', 'Errore nella connessione al server');
        });
      }
    });

  }


}
