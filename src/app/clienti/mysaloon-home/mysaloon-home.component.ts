import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Salone } from 'src/app/Models/Salone';
import { PlannerService } from 'src/app/Services/planner.service';
import { RequiredValidator } from '@angular/forms';

@Component({
  selector: 'app-mysaloon-home',
  templateUrl: './mysaloon-home.component.html',
  styleUrls: ['./mysaloon-home.component.scss']
})
export class MysaloonHomeComponent implements OnInit {

  gruppo: string = '';
  saloni: Salone[];
  urlPrenotazione: string = '';

  constructor(aRoute: ActivatedRoute, private router: Router, private service: SaloniService, private notifier: NotifierService, private appuntamentiService: PlannerService) {
    this.gruppo = aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (!this.service.saloni) {
      this.service.getSaloni(this.gruppo).subscribe(res => {
        this.saloni = res;
      }, (err => {
        this.notifier.notify('warning', 'Errore nella connessione al server');
        console.log(err);
      })
      );
      
    }

  }

  prenota() {

    localStorage.setItem('GruppoCliente', this.gruppo);

    if (this.saloni.length === 1) {
      this.appuntamentiService.GetOpzioniPlanner(this.saloni[0]).subscribe(x => {
        if (x) {
          this.saloni[0].opzioniPlanner = x;
          localStorage.setItem('SaloneCliente', this.saloni[0].salone);

          localStorage.setItem('OpzioniPlanner', JSON.stringify(this.saloni[0].opzioniPlanner));
          this.router.navigate(['prenotazioneclienti/' + this.saloni[0].salone]);
        }
      });

    } else {
      this.router.navigate(['mysaloon/' + this.gruppo]);
    }

  }

}
