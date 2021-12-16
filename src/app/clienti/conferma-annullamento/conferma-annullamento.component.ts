import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Esito } from 'src/app/Models/Esito';
import { PlannerService } from 'src/app/Services/planner.service';

@Component({
  selector: 'app-conferma-annullamento',
  templateUrl: './conferma-annullamento.component.html',
  styleUrls: ['./conferma-annullamento.component.scss']
})
export class ConfermaAnnullamentoComponent implements OnInit {

  token: string = '';
  testo: string = 'Conferma in corso...';

  constructor(private ss: PlannerService, private router:Router) {
    const url = window.location.href;
    if (url.includes('?')) {
      const pos: number = url.indexOf('?') + 7;
      let indirizzo: string = url.substring(pos);
      this.token = decodeURIComponent(indirizzo);
      console.log(this.token);
    }
  }

  ngOnInit(): void {
    this.ss.confermaAnnullamento(this.token).subscribe((x: Esito) => {
      if (x.esito === 'true') {
        this.testo='Eliminazione completata';
      } else {
        this.testo=x.messaggio;
      }
    }, err => {
      console.log(err);
      alert('Server non raggiungibile');
    });
  }

  home(){
    this.router.navigate(['saloni'],{replaceUrl:true});
  }
}
