import { TempFicheService } from './../../Services/temp-fiche.service';
import { TempFiche } from 'src/app/Models/Temp-Fiche';
import { SchedeTecnicheService } from './../../Services/schede-tecniche.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-nuovaschedatecnica',
  templateUrl: './nuovaschedatecnica.component.html',
  styleUrls: ['./nuovaschedatecnica.component.scss']
})
export class NuovaschedatecnicaComponent implements OnInit {

  idFiche: string;
  fiche: TempFiche;
  nomeCliente: string;

  constructor(private location: Location, private route: ActivatedRoute,
              private service: SchedeTecnicheService, private temp: TempFicheService) { }

  ngOnInit() {
    this.idFiche = this.route.snapshot.paramMap.get('id');
    this.temp.getTempFiche(this.idFiche).subscribe(x => {this.fiche = x; });
  }

  save(f: NgForm) {
    if (f.value.scheda) {
      const ris = this.service.addSchedaTecnica(this.fiche.idCliente, f.value.scheda).subscribe(
        x => {
          if (x.esito === 'Ok') {
            setTimeout(()=>{
              this.goBack();
          }, 500);
                
          } else {
            alert('Scheda non memorizzata. ' + x.messaggio)
          }
     
         
        }

      );
    } else {
      alert('Nessun dato da memorizzare');
    }
  }

  goBack() {
    this.location.back();
  }

}
