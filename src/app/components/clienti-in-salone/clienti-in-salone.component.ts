import { ProdottiService } from './../../Services/prodotti.service';
import { CollaboratoriService } from './../../Services/collaboratori.service';
import { TempFiche } from 'src/app/Models/Temp-Fiche';
import { Component, OnInit } from '@angular/core';
import { Router, Event } from '@angular/router';
import { TempFicheService } from 'src/app/Services/temp-fiche.service';
import { ServiziService } from 'src/app/Services/servizi.service';
import { Esito } from 'src/app/Models/Esito';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Salone } from 'src/app/Models/Salone';
import { Location } from '@angular/common';

@Component({
  selector: 'app-clienti-in-salone',
  templateUrl: './clienti-in-salone.component.html',
  styleUrls: ['./clienti-in-salone.component.scss']
})
export class ClientiInSaloneComponent implements OnInit {
  temps: TempFiche[];

  constructor(private router: Router,
              private service: SaloniService,
              private coll: CollaboratoriService,
              private servizi: ServiziService,
              private prodotti: ProdottiService,
              private loc: Location,) {
                this.temps=[];
              }

  ngOnInit() {
    const s:Salone=this.service.saloneCorrente;
    this.service.getTempFiches(s).subscribe(
      x => {this.temps = x;
      console.log(JSON.stringify(x));}
    );
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

  back() {
    this.loc.back();
  }

  mostraAnagrafica(e: MouseEvent, idCliente: string) {
      this.router.navigate(['/cliente/' + idCliente]);
  }
}
