import { Prodotto } from './../../Models/Prodotto';
import { TempFicheService } from 'src/app/Services/temp-fiche.service';
import { Collaboratore } from '../../Models/Collaboratore';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ProposteService } from 'src/app/Services/proposte.service';
import { ConstantsService } from 'src/app/Services/constants.service';
import { Proposta } from 'src/app/Models/Proposta';
import { TempFiche } from 'src/app/Models/Temp-Fiche';

@Component({
  selector: 'app-aggiungiprodotti',
  templateUrl: './aggiungiprodotti.component.html',
  styleUrls: ['./aggiungiprodotti.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AggiungiprodottiComponent implements OnInit {

  @Output() selezioneCollaboratore = new EventEmitter<Collaboratore>();
  colls: Collaboratore[];
  prodotti: Prodotto[];
  collCorrente: Collaboratore;
  IdTempFiche: string;
  proposta: boolean = false;

  expanded:boolean = false;

  constructor(private route: ActivatedRoute, private tf: TempFicheService, private location: Location, private serviceProposte: ProposteService, private cc: ConstantsService) {
    this.colls = JSON.parse(localStorage.getItem('collaboratori'));
    this.IdTempFiche = this.route.snapshot.paramMap.get('idTempFiche');
    this.prodotti = JSON.parse(localStorage.getItem('prodotti'));
    this.proposta = JSON.parse(localStorage.getItem('FlagProposta'));
  }

  ngOnInit() {
    if (localStorage.getItem('collaboratorePredefinito')) {
      this.collCorrente = JSON.parse(localStorage.getItem('collaboratorePredefinito'));
    } else {
      this.collCorrente = JSON.parse(localStorage.getItem('collaboratoreCorrente'));
    }
    this.prodotti = this.prodotti.filter((x: Prodotto) => x.descrizione.indexOf('shampoo', 0) >= 0);
  }

  cercaProdotti(txt: string) {
    if (txt === '') {
      this.prodotti = JSON.parse(localStorage.getItem('prodotti')).filter(x => x.descrizione.indexOf('shampoo', 0) >= 0);
    } else {
      this.prodotti = JSON.parse(localStorage.getItem('prodotti')).filter((x: Prodotto) =>
        x.descrizione.toLowerCase().indexOf(txt.toLowerCase(), 0) >= 0);
    }
  }


  aggiungiProdotto(s: Prodotto) {
    if (this.proposta) {
      let proposte: Proposta[] = [];
      let temp: TempFiche = null;
      this.tf.getTempFiche(this.IdTempFiche).subscribe(x => {
        temp = x;
        this.serviceProposte.getProposteAperte(x.idCliente).subscribe(pp => {
          proposte = pp;

          let flagPresente: boolean = false;
          proposte.forEach(x => {
            console.log(x.idProdotto.trim() === s.id.toString().trim());
            if (x.idProdotto.trim() === s.id.toString().trim()) {
              flagPresente = true;
            }
          })

          if (flagPresente) {
            alert('Servizio già presente nelle proposte aperte');
          } else {
            let p: Proposta = new Proposta();
            p.idCollaboratore = this.collCorrente.id;
            p.idProdotto = s.id;
            p.accettata = '';
            p.collaboratore = this.collCorrente.nome;
            p.cliente = temp.nominativo;
            p.data = this.cc.fDateIT(new Date());
            p.descrizione = s.descrizione;
            p.idCliente = temp.idCliente;
            p.tipo = 'Servizio';

            this.serviceProposte.addProposta(p).subscribe((x: Proposta) => {
              if (x.id !== '' && x.id !== null) {
                this.goBack();
              } else {
                alert('Proposta non memorizzata');
              }
            }, err => {
              console.log(err);
              alert('Server non raggiungibile');
            });
          }

        },err=>{
               console.log(err);
              alert('Server non raggiungibile');
        });
      });
    } else {
      this.tf.addProdotto('Prodotti', this.IdTempFiche, this.collCorrente.id, s.id, '1', s.prezzoVen, '0', s.prezzoVen).subscribe(x => {
        let proposte: Proposta[] = [];
        let temp: TempFiche = null;
        this.tf.getTempFiche(this.IdTempFiche).subscribe(x => {
          temp = x;
          this.serviceProposte.getProposteAperte(x.idCliente).subscribe(pp => {
            proposte = pp;
            if (proposte === null || proposte.length <= 0) {
              this.goBack();
            } else {
              proposte.forEach(p => {
                if (p.idProdotto.trim() === s.id.toString().trim()) {
                  this.serviceProposte.accettaProposta(p).subscribe(pa => {
                    if (pa.esito === 'true') {

                    } else {
                      alert('Proposta non accettata per errori sul server');
                    }
                  });
                }
              });
              this.goBack();
            }
          });
        }, err => {
          alert('Si sono verificati errori sul server');
          this.goBack();
        });

      });

    }
  }
  
  setCollaboratoreCorrente(c: Collaboratore) {
    this.collCorrente = c;
    this.selezioneCollaboratore.emit(c);
    localStorage.setItem('collaboratoreCorrente', JSON.stringify(c));
    if (this.IdTempFiche === '0') {
      localStorage.setItem('collaboratorePredefinito', JSON.stringify(c));
    }
    this.expanded = false;
  }

  goBack() {
    this.location.back();
  }

}
