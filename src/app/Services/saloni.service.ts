import { ConstantsService } from './constants.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/Http';
import { Observable, of } from 'rxjs';
import { Salone } from '../Models/Salone';
import { Cliente } from '../Models/Cliente';
import { GruppoServizi, Produzione } from '../Models/produzione';
import { Incasso } from '../Models/incasso';
import { SpesaGruppo } from '../Models/SpesaGruppo';
import { Collaboratore } from '../Models/Collaboratore';
import { User } from '../Models/User';
import { timeout } from 'rxjs/operators';
import { ClasseClienti } from '../Models/ClasseClienti';
import { Intervallo } from '../Models/Intervallo';
import { CoppiaDate } from '../Models/VociMenu';
import { TempFiche } from '../Models/Temp-Fiche';
import { Stecchiti } from '../Models/Stecchiti';
import { Esito } from '../Models/Esito';

@Injectable({
  providedIn: 'root'
})

export class SaloniService {

  api = '';
  sitoWeb: string = 'https://www.gamainformatica.it/';
  cartella: string = 'mySAPI/api/';

  saloni: Salone[];
  saloneCorrente: Salone;
  intervallo: Intervallo;
  collaboratoreCorrente: Collaboratore;

  constructor(private http: HttpClient, private cc: ConstantsService) {
    this.api = (cc.baseSqlUrl + 'api/myip?gruppo=').replace('/api/api/','/api/');
    console.log(this.api + ' + ' + cc.baseSqlUrl);
    this.sitoWeb = cc.sitoWeb;
    this.cartella = cc.cartella;
  }

  getSaloni(gruppo: string): Observable<Salone[]> {
    const modalitaConsulente: boolean = !!localStorage.getItem('ModalitaConsulente');
    if (!modalitaConsulente) {
      return this.http.get<Salone[]>(this.api + gruppo);
    } else {
      return of(JSON.parse(localStorage.getItem('SaloniConsulente')));
    }
  }

  getGruppoFromId(id: string): Observable<string> {
    return this.http.get<string>((this.cc.baseSqlUrl + 'api/myip/GetGruppoFromId?id=').replace('/api/api/','/api/') + id);
  }

  getAreeConsulente(consulente: string): Observable<string[]> {
    return this.http.get<string[]>((this.cc.baseSqlUrl + 'api/myip/GetAreeConsulente?consulente=').replace('/api/api/','/api/') + consulente + '&token=' + this.cc.getToken() + '&altro=0');
  }

  getSaloniConsulente(consulente: string): Observable<Salone[]> {
    return this.http.get<Salone[]>((this.cc.baseSqlUrl + 'api/myip/GetmyIPConsulente?consulente=').replace('/api/api/','/api/') + consulente + '&token=' + this.cc.getToken());
  }

  getSaloniConsulenteFiltrati(consulente: string, area: string, gruppo: string, salone: string): Observable<Salone[]> {
    return this.http.get<Salone[]>((this.cc.baseSqlUrl + 'api/myip/GetmyIPConsulenteFilter?consulente=').replace('/api/api/','/api/') + consulente + '&area=' + area + '&gruppo=' + gruppo + '&salone=' + salone + '&token=' + this.cc.getToken());
  }

  getAnagraficaSolone(s: Salone): Observable<Salone> {
    return this.http.get<Salone>(this.sitoWeb + this.cartella + 'salone/getvalue?parametri=' + s.gruppo + ';' + s.salone + ';' + this.cc.getToken() + ';Web');
  }


  getSalone(s: Salone, data1: string, data2: string): Observable<Salone> {
    var t: number = 8000;
    if (!localStorage.getItem('TimeOut')) {
      localStorage.setItem('TimeOut', '5000')
    } else {
      t = Number(localStorage.getItem('TimeOut'));
    }

    if (data1 === '' || data1 === null) {
      var date = new Date();

      data1 = JSON.stringify(date.getDate());
      data2 = JSON.stringify(date.getDate());
      //alert(date.getDate().toLocaleString('it'));
    }

    if (s.destinazione.toLocaleLowerCase() === 'web') {
      //console.log(this.sitoWeb + this.cartella + 'statistiche/salone?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
      /*       const headerDict = {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Headers': 'Content-Type',
            }

            const requestOptions = {
              headers: new HttpHeaders (headerDict),
            };)

       */
      //console.log(this.sitoWeb + this.cartella + 'statistiche/salone?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
      return this.http.get<Salone>(this.sitoWeb + this.cartella + 'statistiche/salone?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      //console.log(s.indirizzoIP + ':' + s.porta + '/api/statistiche/salone?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
      return this.http.get<Salone>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/salone?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione)
        .pipe(timeout(t));
    }
  }

  getSaloneCompleto(s: Salone, data1: string, data2: string): Observable<Salone> {
    var t: number = 8000;
    if (!localStorage.getItem('TimeOut')) {
      localStorage.setItem('TimeOut', '5000')
    } else {
      t = Number(localStorage.getItem('TimeOut'));
    }

    if (data1 === '' || data1 === null) {
      var date = new Date();

      data1 = date.getDate().toString();
      data2 = date.getDate().toString();
      //alert(date.getDate().toLocaleString('it'));
    }
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      //alert(this.sitoWeb + 'mySapi/api/statistiche/salone?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
      return this.http.get<Salone>(this.sitoWeb + this.cartella + 'statistiche/saloneCompleto?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      //alert(s.indirizzoIP + ':' + s.porta + '/api/statistiche/salone?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
      return this.http.get<Salone>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/saloneCompleto?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione)
        .pipe(timeout(t));
    }
  }

  getPassaggi(s: Salone, data1: string, data2: string): Observable<Cliente[]> {
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      return this.http.get<Cliente[]>(this.sitoWeb + this.cartella + 'statistiche/passaggi?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<Cliente[]>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/passaggi?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }

  }

  getProduzione(s: Salone, data1: string, data2: string): Observable<Produzione> {
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      return this.http.get<Produzione>(this.sitoWeb + this.cartella + 'statistiche/produzione?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<Produzione>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/produzione?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }
  }

  getDettagliProduzione(s: Salone, data1: string, data2: string): Observable<GruppoServizi[]> {
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      return this.http.get<GruppoServizi[]>(this.sitoWeb + this.cartella + 'statistiche/dettagliProduzione?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<GruppoServizi[]>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/dettagliProduzione?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }
  }

  getNuoviClienti(s: Salone, data1: string, data2: string): Observable<Cliente[]> {
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      return this.http.get<Cliente[]>(this.sitoWeb + this.cartella + 'statistiche/nuoviClienti?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<Cliente[]>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/nuoviClienti?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }

  }

  getClassiClienti(s: Salone): Observable<ClasseClienti[]> {
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      return this.http.get<ClasseClienti[]>(this.sitoWeb + this.cartella + 'statistiche/ClassiClienti?parametri=' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<ClasseClienti[]>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/ClassiClienti?parametri=' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }

  }

  getFuoriFrequenza(s: Salone, data1: string, data2: string, categoria: string): Observable<Cliente[]> {
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      //alert(this.sitoWeb + 'mySapi/api/statistiche/fuoriFrequenza?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione + ';' + categoria);
      return this.http.get<Cliente[]>(this.sitoWeb + this.cartella + 'statistiche/fuoriFrequenza?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione + ';' + categoria);
    } else {
      //alert(s.indirizzoIP + ':' + s.porta + '/api/statistiche/fuoriFrequenza?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione + ';' + categoria);
      return this.http.get<Cliente[]>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/fuoriFrequenza?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione + ';' + categoria);
    }
  }

  getDettagliCollaboratori(s: Salone, data1: string, data2: string, idCollaboratore: string): Observable<GruppoServizi[]> {
    console.log(s.indirizzoIP + '-' + s.porta + '-' + s.destinazione);
    if (!localStorage.getItem('BaseAppURL')) {
      localStorage.setItem('BaseAppURL', this.cc.baseAppUrl);
    }
    const localApi = localStorage.getItem('BaseAppURL');

    if (s.destinazione.toLocaleLowerCase() === 'web') {
      //alert(this.sitoWeb + 'mySapi/api/statistiche/dettagliCollaboratori?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione + ';' + idCollaboratore);
      return this.http.get<GruppoServizi[]>(this.sitoWeb + this.cartella + 'statistiche/dettagliCollaboratori?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione + ';' + idCollaboratore);
    } else {
      //alert(s.indirizzoIP + ':' + s.porta + '/api/statistiche/dettagliCollaboratori?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione + ';' + idCollaboratore);
      return this.http.get<GruppoServizi[]>(localApi + 'statistiche/dettagliCollaboratori?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione + ';' + idCollaboratore);
    }
  }

  getIncasso(s: Salone, data1: string, data2: string): Observable<Incasso> {
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      return this.http.get<Incasso>(this.sitoWeb + this.cartella + 'statistiche/incasso?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<Incasso>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/incasso?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }
  }

  getSpese(s: Salone, data1: string, data2: string): Observable<SpesaGruppo[]> {
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      return this.http.get<SpesaGruppo[]>(this.sitoWeb + this.cartella + 'statistiche/spese?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<SpesaGruppo[]>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/spese?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }
  }

  getStatistiche(s: Salone, data1: string, data2: string): Observable<Collaboratore[]> {
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      return this.http.get<Collaboratore[]>(this.sitoWeb + this.cartella + 'statistiche/collaboratori?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<Collaboratore[]>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/collaboratori?parametri=' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }
  }

  getTempFiches(s: Salone): Observable<TempFiche[]> {
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      return this.http.get<TempFiche[]>(this.sitoWeb + this.cartella + 'tempfiche/lista?parametri=' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<TempFiche[]>(s.indirizzoIP + ':' + s.porta + '/api/tempfiche/lista?parametri=' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }
  }

  getClientiInsalone(s: Salone, data1: string, data2: string): Observable<Cliente[]> {
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      return this.http.get<Cliente[]>(this.sitoWeb + this.cartella + 'statistiche/clientiInSalone?' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<Cliente[]>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/clientiInSalone?' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }
  }

  getFiche(s: Salone, idFiche: string): Observable<TempFiche> {
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      return this.http.get<TempFiche>(this.sitoWeb + this.cartella + 'statistiche/fiche?parametri=' + idFiche + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<TempFiche>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/fiche?parametri=' + idFiche + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }
  }

  getStecchiti(s: Salone): Observable<Stecchiti[]> {
    if (s.destinazione.toLocaleLowerCase() === 'web') {
      return this.http.get<Stecchiti[]>(this.sitoWeb + this.cartella + 'statistiche/clientiStecchiti?parametri=' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<Stecchiti[]>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/clientiStecchiti?parametri=' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }
  }

  getStecchitidelMese(s: Salone, riga: string, colonna: string): Observable<Cliente[]> {
    if (s.destinazione.toLocaleLowerCase().toLocaleLowerCase() === 'web') {
      return this.http.get<Cliente[]>(this.sitoWeb + this.cartella + 'statistiche/clientiStecchitiDelMese?parametri=' + riga + ';' + colonna + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<Cliente[]>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/clientiStecchitiDelMese?parametri=' + riga + ';' + colonna + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }
  }

  getClientiServiti(s: Salone, idCollaboratore: string, Servizio: string, data1: string, data2: string): Observable<Cliente[]> {
    if (s.destinazione.toLowerCase().toLocaleLowerCase() === 'web') {
      return this.http.get<Cliente[]>(this.sitoWeb + this.cartella + 'statistiche/clientiServiti?parametri=' + idCollaboratore + ';' + Servizio + ';' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    } else {
      return this.http.get<Cliente[]>(s.indirizzoIP + ':' + s.porta + '/api/statistiche/clientiServiti?parametri=' + idCollaboratore + ';' + Servizio + ';' + data1 + ';' + data2 + ';' + s.gruppo + ';' + s.salone + ';' + '' + ';' + s.destinazione);
    }
  }

  updateMyIp(s: Salone): Observable<string> {
    //console.log(JSON.stringify(s));
    return this.http.put<string>((this.cc.baseSqlUrl + 'api/myIP/UpdatemyIP').replace('/api/api/','/api/'), s);
  }

  addUser(s: User): Observable<User> {
    return this.http.post<User>((this.cc.baseSqlUrl + 'api/utenti/AddUtenti').replace('/api/api/','/api/'), s);
  }

  confermaRegistrazione(codice: string): Observable<boolean> {
    return this.http.get<boolean>((this.cc.baseSqlUrl + 'api/utenti/ConfermaRegistrazione?id=').replace('/api/api/','/api/') + codice);
  }


  addUserCliente(s: User): Observable<User> {
    console.log(this.cc.baseSqlUrl + 'api/utenti/AddUtentiPlanner');
    return this.http.post<User>((this.cc.baseSqlUrl + 'api/utenti/AddUtentiPlanner').replace('/api/api/','/api/'), s);
  }

  addUserClienteFromPlanner(s: User): Observable<User> {
    console.log(this.cc.baseSqlUrl + 'api/utenti/AddUtentiPlanner');
    return this.http.post<User>((this.cc.baseSqlUrl + 'api/utenti/AddUtenteFromPlanner').replace('/api/api/','/api/'), s);
  }


  recuperaPassword(gruppo:string, salone:string, email:string, cell:string): Observable<Esito> {
    return this.http.get<Esito>((this.cc.baseSqlUrl + 'api/utenti/recuperaPassword').replace('/api/api/','/api/') + '?Gruppo=' + gruppo + '&Salone=' + salone + '&email=' + email + '&cell=' + cell);
  }

  impostaIntervalli(x: Intervallo) {
    if (x.id === 0) {
      var curr = new Date;
      x.data1 = new Date(curr.setDate(curr.getDate() - 1)).toLocaleDateString();
      x.data2 = x.data1;
      x.name = 'Ieri      ' + x.data1;
      x.codice = 'ieri';
    } else if (x.id === 1) {
      x.data1 = new Date().toLocaleDateString();
      x.data2 = x.data1;
      x.name = 'Oggi      ' + x.data1;
      x.codice = 'oggi';
    } else if (x.id === 2) {
      var curr = new Date;
      x.data1 = new Date(curr.setDate(curr.getDate() - (curr.getDay() === 0 ? 7 : curr.getDay()) + 1)).toLocaleDateString();
      x.data2 = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7)).toLocaleDateString();
      x.name = 'Questa settimana      dal ' + x.data1 + ' al ' + x.data2;
      x.codice = 'settimana';
    } else if (x.id === 3) {
      var curr = new Date;
      var mese = curr.getMonth() + 1;
      x.data1 = '01/' + mese + '/' + curr.getFullYear().toFixed();
      x.data2 = curr.toLocaleDateString();
      x.name = 'Questo mese      dal ' + x.data1 + ' al ' + x.data2;
      x.codice = 'mese';
    } else if (x.id === 4) {
      var curr = new Date;
      x.data1 = '01/01' + '/' + curr.getFullYear().toFixed();
      x.data2 = curr.toLocaleDateString();

      x.name = 'Questo anno      dal ' + x.data1 + ' al ' + x.data2;
      x.codice = 'anno';
    } else if (x.id === 5) {
      var curr = new Date;
      var mese = curr.getMonth() + 1;
      x.data1 = '01/' + mese + '/' + curr.getFullYear().toFixed();
      x.data2 = '10/' + mese + '/' + curr.getFullYear().toFixed();

      x.name = 'Primi 10 giorni  (dal ' + x.data1 + ' al ' + x.data2 + ')';
      x.codice = '10';
    } else if (x.id === 6) {
      var curr = new Date;
      var mese = curr.getMonth() + 1;
      x.data1 = '11/' + mese + '/' + curr.getFullYear().toFixed();
      x.data2 = '20/' + mese + '/' + curr.getFullYear().toFixed();

      x.name = 'Secondi 10 giorni  (dal ' + x.data1 + ' al ' + x.data2 + ')';
      x.codice = '20';
    }
    else if (x.id === 7) {
      var curr = new Date;
      var mese = curr.getMonth() + 1;
      x.data1 = '21/' + mese + '/' + curr.getFullYear().toFixed();
      x.data2 = new Date(curr.getFullYear(), curr.getMonth() + 1, 0).getDate().toString() + '/' + mese + '/' + curr.getFullYear().toFixed();

      x.name = 'Terzi 10 giorni  (dal ' + x.data1 + ' al ' + x.data2 + ')';
      x.codice = '30';
    }

  }

  settimanaCorrente(): CoppiaDate {
    let cd: CoppiaDate = new CoppiaDate;

    var curr = new Date;
    cd.data1 = new Date(curr.setDate(curr.getDate() - (curr.getDay() === 0 ? 7 : curr.getDay()) + 1)).toLocaleDateString();
    cd.data2 = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7)).toLocaleDateString();

    return cd
  }

  meseCorrente(): CoppiaDate {
    let cd: CoppiaDate = new CoppiaDate;

    var curr = new Date;
    cd.data1 = new Date(curr.getFullYear(), curr.getMonth(), 1).toLocaleDateString();
    cd.data2 = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate()).toLocaleDateString();

    return cd
  }

  getDieci(data: Date): CoppiaDate {
    let cd: CoppiaDate = new CoppiaDate;

    if (data.getDate() >= 21) {
      cd.data1 = new Date(data.getFullYear(), data.getMonth(), 21).toLocaleDateString();
      cd.data2 = new Date(data.getFullYear(), data.getMonth() + 1, 0).toLocaleDateString();
    } else if (data.getDate() >= 11) {
      cd.data1 = new Date(data.getFullYear(), data.getMonth(), 11).toLocaleDateString();
      cd.data2 = new Date(data.getFullYear(), data.getMonth(), 20).toLocaleDateString();
    } else {
      cd.data1 = new Date(data.getFullYear(), data.getMonth(), 1).toLocaleDateString();
      cd.data2 = new Date(data.getFullYear(), data.getMonth(), 10).toLocaleDateString();
    }

    return cd
  }

  annoCorrente(): CoppiaDate {
    let cd: CoppiaDate = new CoppiaDate;

    var curr = new Date;
    cd.data1 = new Date(curr.getFullYear(), 0, 1).toLocaleDateString();
    cd.data2 = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate()).toLocaleDateString();

    return cd
  }

  generaIndirizzoPlanner(s: Salone): Observable<Salone> {
    return this.http.get<Salone>((this.cc.baseSqlUrl + 'api/myip/GeneraIndirizzoPlannerConToken?gruppo=').replace('/api/api/','/api/') + s.gruppo + '&salone=' + s.salone);
  }


}
