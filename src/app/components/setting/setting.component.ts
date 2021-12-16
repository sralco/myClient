import { User } from './../../Models/User';
import { UsersService } from './../../Services/users.service';
import { Collaboratore } from './../../Models/Collaboratore';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  coll: Collaboratore;
  verificaAperturaFiche = false;
  abilitaSchedeTecniche = false;
  mostraCampoPassword = false;
  testoSchedaTecnica = 'Abilita schede tecniche';
  pass = 'a';
  baseAppURL: string;
  gruppoSaloni: string;
  timeout:number;
  sesso: string;

  constructor(private location: Location, private usersService: UsersService) {
    if (localStorage.getItem('verificaaperturafiche') === 'false') {
      this.verificaAperturaFiche = false;
    } else {
      this.verificaAperturaFiche = true;
    }

    if (!this.verificaAperturaFiche) {
      this.verificaAperturaFiche = false;
      localStorage.setItem('verificaaperturafiche', 'false');
    }

    if (localStorage.getItem('abilitaschedetecniche') === 'false') {
      this.abilitaSchedeTecniche = false;
    } else {
      this.abilitaSchedeTecniche = true;
    }

    if (localStorage.getItem('TimeOut')) {
      this.timeout = Number.parseInt(localStorage.getItem('TimeOut'));
    } else {
      this.timeout =5000;
    }

    this.impostaSchedeTecniche();

    this.baseAppURL = localStorage.getItem('BaseAppURL');
    this.gruppoSaloni = localStorage.getItem('GruppoSaloni');

    this.sesso = localStorage.getItem('Sesso');
    if (!this.sesso) {
      this.sesso = 'Donna';
      localStorage.setItem('Sesso', 'Donna');
    }
  }

  ngOnInit() {
    this.coll = JSON.parse(localStorage.getItem('collaboratorePredefinito'));
    if (!this.coll) {
      this.coll = new Collaboratore();
      this.coll.codice = 'Seleziona collaboratore';
    }
  }

  goBack() {
    this.location.back();
  }

  resetServizi() {
    localStorage.removeItem('servizi');
  }

  resetProdotti() {
    localStorage.removeItem('prodotti');
  }

  resetCollaboratori() {
    localStorage.removeItem('collaboratori');
  }

  impostaVerificaApertura() {
    localStorage.setItem('verificaaperturafiche', String(!this.verificaAperturaFiche));
  }

  setBaseAppURL() {
    localStorage.setItem('BaseAppURL', this.baseAppURL);
  }
  setGruppoSaloni() {
    localStorage.setItem('GruppoSaloni', this.gruppoSaloni);
  }
  setTimeout() {
    localStorage.setItem('TimeOut', this.timeout.toString());
  }

  impostaSchedeTecniche() {
    if (this.abilitaSchedeTecniche) {
      this.testoSchedaTecnica = 'Disabilita schede tecniche';
      localStorage.setItem('abilitaschedetecniche', 'true');
    } else {
      this.testoSchedaTecnica = 'Abilita schede tecniche';
      localStorage.setItem('abilitaschedetecniche', 'false');
    }

  }

  mostraPassword() {
    this.mostraCampoPassword = true;
  }

  setPassword(e) {
    this.pass = e;
  }
  confermaPassword() {
    this.usersService.getUser('Administrator').subscribe((x: User) => {
      if (x.pwd === this.pass) {
        this.abilitaSchedeTecniche = !this.abilitaSchedeTecniche;
        this.mostraCampoPassword = false;
        this.impostaSchedeTecniche();
      } else {
        alert('Password non corretta.');
      }
      this.pass = '';
    });
  }

  setGender(sesso: string) {
    localStorage.setItem('Sesso', sesso);
    console.log(localStorage.getItem('Sesso'));
  }

}

