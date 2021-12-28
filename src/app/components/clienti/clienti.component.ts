import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Cliente } from './../../Models/Cliente';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ClientiService } from 'src/app/Services/clienti.service';
import { viewClassName } from '@angular/compiler';

@Component({
  selector: 'app-clienti',
  templateUrl: './clienti.component.html',
  styleUrls: ['./clienti.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClientiComponent implements OnInit {

  clienti: Cliente[];
  search: string;

  constructor(private srvClienti: ClientiService, private location: Location, private route: Router, private aRoute: ActivatedRoute) {
    this.search = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    /* this.srvClienti.getClientiIniziali().subscribe(x => {
       this.clienti = x;
        }); */
    console.log('Testo ricerca ' + this.search);
    if (this.search) {
      console.log('Ritardo la ricerca di  1 secondo');
      this.wait(1000);
      console.log('Effettuo la ricerca di ' + this.search);
      this.searchClienti(this.search);
    }
  }

  wait(ms: number) {
    const start = new Date().getTime();
    let end = start;
    while (end < start + ms) {
      end = new Date().getTime();
   }
 }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  nuovoIngresso(idCliente: string) {
    this.srvClienti.nuovoIngressoCliente(idCliente).subscribe(x => {
      if ((x.id !== '') && (x.esito === 'Ok')) {
        this.route.navigate(['/fiche/' + x.id]);
      } else {
        alert(x.messaggio + ' - ' + x.tag);
      }
    });
  }

  searchClienti(txt: string) {
    if (txt.length > 2) {
      this.srvClienti.getClienti(txt).subscribe(
        x => { this.clienti = x; }
      );
    }
  }

  goBack() {
    this.route.navigate(['/home/']);
  }

}
