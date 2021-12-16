import { Component, ContentChildren, OnInit } from '@angular/core';
import { Collaboratore } from 'src/app/Models/Collaboratore';
import { CoppiaChiaveValore } from 'src/app/Models/CoppiaChiaveValore';
import { Obiettivo } from 'src/app/Models/Obiettivo';
import { ObiettiviService } from 'src/app/Services/obiettivi.service';
import { Location } from '@angular/common';
import { ConstantsService } from 'src/app/Services/constants.service';

export class App extends CoppiaChiaveValore {
  obiettivi: Obiettivo[];
  constructor() { super(); }
}

@Component({
  selector: 'app-obiettivi',
  templateUrl: './obiettivi.component.html',
  styleUrls: ['./obiettivi.component.scss']
})
export class ObiettiviComponent implements OnInit {

  listaObiettivi: App[] = [];
  collaboratore: Collaboratore;
  attesa: boolean = true;

  constructor(private obiettiviService: ObiettiviService, private loc: Location, public constService: ConstantsService) {
    this.collaboratore = JSON.parse(localStorage.getItem('collaboratorePredefinito'));
  }

  ngOnInit(): void {
    this.getListaObiettivi();
  }

  getListaObiettivi() {
    this.obiettiviService.getListaObiettivi().subscribe(x => {
      x.forEach(y=>{
        let a:App=new App();
        a.id=y.id;
        a.value=y.value;
        this.listaObiettivi.push(a);
      })
      if (this.listaObiettivi.length > 0) {
        this.listaObiettivi[0].tag = "Show";
        console.log(this.listaObiettivi[0].tag);
        this.getObiettivi(this.listaObiettivi[0]);
      }
    }, err => {
      alert('Impossibile recuperare la lista degli obiettivi');
      console.log(err);
    });
    this.attesa = false;
  }

  getObiettivi(o: App) {
    this.obiettiviService.getObiettivi(this.collaboratore.id, o.id).subscribe(x => {
      o.obiettivi = x;
    }, err => {
      alert('Impossibile recuperare gli obiettivi');
      console.log(err);
    });
  }

  back() {
    this.loc.back();
  }

}

