import { ProdottiService } from './../../Services/prodotti.service';
import { CollaboratoriService } from './../../Services/collaboratori.service';
import { TempFiche } from 'src/app/Models/Temp-Fiche';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TempFicheService } from 'src/app/Services/temp-fiche.service';
import { ServiziService } from 'src/app/Services/servizi.service';
import { Esito } from 'src/app/Models/Esito';
import { Collaboratore } from 'src/app/Models/Collaboratore';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Intervallo } from 'src/app/Models/Intervallo';
import { Salone } from 'src/app/Models/Salone';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  temps: TempFiche[];

  constructor(
    private router: Router,
    private service: TempFicheService,
    private coll: CollaboratoriService,
    private servizi: ServiziService,
    private prodotti: ProdottiService,
    private saloneService: SaloniService
  ) { }

  ngOnInit() {
    this.service.getTempFiches().subscribe(
      x => this.temps = x
    );

    if (!localStorage.getItem('collaboratori')) {
      this.coll.getCollaboratori().subscribe(x => {
        localStorage.setItem('collaboratori', JSON.stringify(x));
        localStorage.setItem('collaboratoreCorrente', JSON.stringify(x[0]));
      });
    } else {
      localStorage.setItem('collaboratoreCorrente', JSON.stringify(JSON.parse(localStorage.getItem('collaboratori'))[0]));
    }
    if (!localStorage.getItem('servizi')) {
      this.servizi.getServizi('Servizi').subscribe(x => localStorage.setItem('servizi', JSON.stringify(x)));
    }
    if (!localStorage.getItem('prodotti')) {
      this.prodotti.getProdotti('Prodotti').subscribe(x => localStorage.setItem('prodotti', JSON.stringify(x)));
    }

  }

  reload(){
    window.location.reload();
  }

  searchClienti(txt: string) {
    /* const searchEle = document.querySelector('#search');
     const txt = searchEle.textContent;*/
    if (txt.length > 1) {
      this.service.trovaTempFiche(txt).subscribe(
        x => { this.temps = x; }
      );
    } else if (txt.length === 0) {
      this.service.getTempFiches().subscribe(
        x => this.temps = x
      );
    }
  }

  // t.cell ? 'cadetblue' : 'red'
  setColor(t: TempFiche): string {
    if (!t.cell && !t.email) {
      return 'red';
    } else if (!t.cell || !t.email) {
      if (!t.cell) {
        return 'lightcoral';
      } else {
        return 'mediumturquoise';
      }
      return 'orange';
    } else {
      return 'cadetblue';
    }
  }

  // t.cell ? '' : 'Cellulare'
  setText(t: TempFiche): string {
    if (!t.cell && !t.email) {
      return 'Cell+Email';
    } else if (!t.cell || !t.email) {
      if (!t.cell) {
        return 'Cellulare';
      } else {
        return 'Email';
      }
      return 'orange';
    } else {
      return '';
    }
  }

  suppressNavigate(e: MouseEvent) {
    e.stopPropagation();
  }

  verificaDisponibilitaApertura(e: MouseEvent, idTempFiche: string) {
    this.service.disponibilePerApertura(idTempFiche).subscribe((x: Esito) => {
      if (x.esito === 'Ok') {
        this.router.navigate(['/fiche/' + idTempFiche]);
      } else {
        e.stopPropagation();
        alert('La fiche risulta aperta su altre postazioni');
      }
    });
  }

  mostraAnagrafica(e: MouseEvent, idCliente: string) {
    this.router.navigate(['/cliente/' + idCliente]);
  }

  dettagliCollaboratore() {
    const intervallo = new Intervallo();
    intervallo.data1 = new Date().toLocaleDateString();
    intervallo.data2 = new Date().toLocaleDateString();
    intervallo.name = '';
    this.saloneService.intervallo = intervallo;
    localStorage.setItem('Intervallo', JSON.stringify(intervallo));

    let cc: Collaboratore = new Collaboratore();
    const app = localStorage.getItem('collaboratorePredefinito');
    if (app) {
      cc = JSON.parse(app);
    }

    this.saloneService.collaboratoreCorrente = cc;

    let s: Salone = new Salone();
    s.gruppo = '';
    s.salone = cc.nome + ''; + cc.cognome;
    s.destinazione = 'web';
    this.saloneService.saloneCorrente = s;
    localStorage.setItem('SaloneCorrente', JSON.stringify(s));
    this.router.navigate(['obiettivi']);
  }

  scattaFoto(t: TempFiche) {
    this.router.navigate(['scattafoto/' + t.idCliente]);
  }
}
