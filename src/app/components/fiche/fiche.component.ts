import { Collaboratore } from './../../Models/Collaboratore';
import { SchedaTecnica } from './../../Models/SchedaTecnica';
import { SchedeTecnicheService } from './../../Services/schede-tecniche.service';
import { ProdottoInTempFiche } from '../../Models/ProdottoInTempFiche';
import { Component, OnInit } from '@angular/core';
import { TempFicheService } from 'src/app/Services/temp-fiche.service';
import { TempFiche } from 'src/app/Models/Temp-Fiche';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposteService } from 'src/app/Services/proposte.service';
import { Proposta } from 'src/app/Models/Proposta';
import { ProposteComponent } from './proposte/proposte.component';
import { MatDialog } from '@angular/material/dialog';
import { AggiungiserviziComponent } from '../aggiungiservizi/aggiungiservizi.component';

@Component({
  selector: 'app-fiche',
  templateUrl: './fiche.component.html',
  styleUrls: ['./fiche.component.scss']
})
export class FicheComponent implements OnInit {

  idFiche: string;
  fiche: TempFiche;
  idCollaboratoreCorrente: string;
  schedeTecniche: SchedaTecnica[];
  proposte: Proposta[] = [];
  collaboratori: Collaboratore[];
  apriProposte: boolean = true;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: TempFicheService,
    private schede: SchedeTecnicheService,
    private location: Location,
    private serviceProposte: ProposteService,
    private dialog: MatDialog) {
    this.idFiche = this.route.snapshot.paramMap.get('id');
    this.collaboratori = JSON.parse(localStorage.getItem('collaboratori'));
    this.fiche = new TempFiche();
  }

  ngOnInit() {
    this.service.getTempFiche(this.idFiche).subscribe(x => {
      this.fiche = x;
      this.getProposteAperte();
      if (localStorage.getItem('abilitaschedetecniche') === 'true') {
        this.schede.getSchedeTecniche(x.idCliente).subscribe(ss => {
           this.schedeTecniche = ss; 
          
          });
      
      }
    });

  }

  getNomeCollaboratore(id: string): string {
    const coll = this.collaboratori.find(x => x.id === id);
    return coll.nome;
  }

  delete(e: MouseEvent, b: ProdottoInTempFiche, tipo: string) {
    e.stopPropagation();
    let ntipo = 'Servizi';
    if (tipo === 'Prodotti') {
      ntipo = tipo;
    }
    const ris = confirm('Rimuovere la riga selezionata?');
    if (ris) {
      this.service.rimuoviProdottoDaTempFiche(ntipo, this.idFiche, b.testo).subscribe(x => {
        if (x.esito === 'Ok') {
          this.service.getTempFiche(this.idFiche).subscribe(xx => this.fiche = xx);
        } else {
          alert(x.messaggio);
        }
      });
    }
  }

  nuovaSchedaTecnica(e: MouseEvent) {
    e.stopPropagation();
  }

  nuovoServizio(e: MouseEvent, proposta: boolean) {
    e.stopPropagation();
    localStorage.setItem('FlagProposta', String(proposta));
  }

  nuovoProdotto(e: MouseEvent, proposta: boolean) {
    e.stopPropagation();
    localStorage.setItem('FlagProposta', String(proposta));
  }

  getProposteAperte() {
    this.serviceProposte.getProposteAperte(this.fiche.idCliente).subscribe((x: Proposta[]) => {
      this.proposte = x;
      console.log(x);
      if (this.proposte.length > 0) {
        if (this.apriProposte) {
          if (localStorage.getItem('ProposteAperte') !== 'aperte') {
            this.openProposte();
            localStorage.setItem('ProposteAperte', 'aperte');
          }
        }
      }
    }, err => {
      console.log(err);
      alert('Non è stato possibile recuperare le Proposte')
    });
  }

  openProposte() {
    const dialogRef = this.dialog.open(ProposteComponent, {
      minWidth: '100vw !important',
      minHeight: '100vw !important',
      data: this.proposte
    });
    dialogRef.afterClosed().subscribe(s => {
      this.apriProposte = false;
      this.getProposteAperte();
    });
  }

  setProposta() {
    localStorage.setItem('FlagProposta', 'true');
  }

  apriConsulenza(){
    this.router.navigate(['consulenza/' + this.fiche.idCliente]);
  }

  goBack() {
    this.location.back();
  }

}
