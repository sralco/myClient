import { ConstantsService } from './constants.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/Http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Esito } from '../Models/Esito';
import { Appuntamento } from '../Models/Appuntamento';
import { Collaboratore } from '../Models/Collaboratore';
import { Salone } from '../Models/Salone';
import { Cliente } from '../Models/Cliente';
import { Servizio } from '../Models/Servizio';
import { DisponibilitaPrenotazione } from '../Models/DisponibilitaPrenotazione';
import { Prenotazione } from '../Models/Prenotazione';
import { OpzioniPlanner } from '../Models/OpzioniPlanner';
import { User } from '../Models/User';


const httpOption = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class PlannerService {

  private api = '';
  sitoWeb: string = '';
  cartella: string = 'mySAPI/api/';
  planner: string = 'web';

  constructor(private http: HttpClient, private cc: ConstantsService) {
    this.api = cc.baseAppUrl + 'planner/';
    this.sitoWeb = cc.sitoWeb;
    this.cartella = cc.cartella;
    const app = localStorage.getItem("PlannerCorrente");
    if (app) {
      this.planner = app.split(';')[5];
    }
    if (this.planner === 'web' || this.planner === null) {
      this.cartella = (cc.baseSqlUrl + 'api/').replace('/api/api/','/api/');
    }
  }

  getPlanner(s: Salone, data1: string, data2: string, idCollaboratore: string): Observable<Appuntamento[]> {
    /* const a = { id: 1, nome: 'aaa' }
    const headers = new HttpHeaders().append('header', 'a');
    const params = new HttpParams().append('param', JSON.stringify(a)); */
    if (this.planner === 'web') {
      return this.http.get<Appuntamento[]>(this.cartella + 'Appuntamenti/ListaEventi?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&Data1=' + data1 + '&Data2=' + data2 + '&IdCollaboratore=' + idCollaboratore);
    } else {
      if (s.destinazione === 'Web') {
        return this.http.get<Appuntamento[]>(this.sitoWeb + this.cartella + 'planner/ListaEventi?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&Data1=' + data1 + '&Data2=' + data2 + '&IdCollaboratore=' + idCollaboratore);
      } else {
        return this.http.get<Appuntamento[]>(s.indirizzoIP + ':' + s.porta + '/planner/ListaEventi?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&Data1=' + data1 + '&Data2=' + data2 + '&IdCollaboratore=' + idCollaboratore);
      }
    }
  }

  getCollaboratori(s: Salone): Observable<Collaboratore[]> {
      console.log(this.cartella + 'Appuntamenti/listaCollaboratori?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione);
    if (this.planner === 'web') {
      return this.http.get<Collaboratore[]>(this.cartella + 'Appuntamenti/listaCollaboratori?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione);
    } else {
      if (s.destinazione === 'Web') {
        console.log(this.sitoWeb + this.cartella + 'planner/listaCollaboratori?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione);
        return this.http.get<Collaboratore[]>(this.sitoWeb + this.cartella + 'planner/listaCollaboratori?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione);
      } else {
        return this.http.get<Collaboratore[]>(s.indirizzoIP + ':' + s.porta + '/planner/listaCollaboratori?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione);
      }
    }
  }

  getClienti(s: Salone, txt: string): Observable<Cliente[]> {
    if (this.planner === 'web') {
      return this.http.get<Cliente[]>(this.cartella + 'Appuntamenti/CercaClientiPlanner?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&txt=' + txt);
    } else {
      if (s.destinazione === 'Web') {
        return this.http.get<Cliente[]>(this.sitoWeb + this.cartella + 'planner/CercaClientiPlanner?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&txt=' + txt);
      } else {
        return this.http.get<Cliente[]>(s.indirizzoIP + ':' + s.porta + 'planner/CercaClientiPlanner?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&txt=' + txt);
      }
    }
  }

  getDisponibilita(s: Salone, p: Prenotazione): Observable<DisponibilitaPrenotazione> {
    /*      const headerDict = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
           const requestOptions = {
            headers: new HttpHeaders(headerDict),
          };
     */
    if (this.planner === 'web') {
      return this.http.post<DisponibilitaPrenotazione>(this.cartella + 'Appuntamenti/VerificaDisponibilita', p);
    } else {
      if (s.destinazione === 'Web') {
        return this.http.post<DisponibilitaPrenotazione>(this.sitoWeb + this.cartella + 'planner/VerificaDisponibilita', p);
      } else {
        return this.http.post<DisponibilitaPrenotazione>(s.indirizzoIP + ':' + s.porta + 'planner/VerificaDisponibilita', p);
      }
    }
  }

  getDisponibilitaAtTime(s: Salone, p: Prenotazione): Observable<boolean> {
    if (this.planner === 'web') {
      return this.http.post<boolean>(this.cartella + 'Appuntamenti/VerificaDisponibilitaAtTime', p);
    } else {
      if (s.destinazione === 'Web') {
        return this.http.post<boolean>(this.sitoWeb + this.cartella + 'planner/VerificaDisponibilitaAtTime', p);
      } else {
        return this.http.post<boolean>(s.indirizzoIP + ':' + s.porta + 'planner/VerificaDisponibilitaAtTime', p);
      }
    }
  }

  salvaPrenotazione(s: Salone, p: Prenotazione): Observable<Esito> {
    if (this.planner === 'web') {
      return this.http.post<Esito>(this.cartella + 'Appuntamenti/PostValue', p);
    } else {
      if (s.destinazione === 'Web') {
        return this.http.post<Esito>(this.sitoWeb + this.cartella + 'planner/PostValue', p);
      } else {
        return this.http.post<Esito>(s.indirizzoIP + ':' + s.porta + 'planner/PostValue', p);
      }
    }
  }

  salvaPrenotazioneSemplice(s: Salone, p: Prenotazione): Observable<Appuntamento[]> {
    if (this.planner === 'web') {
      return this.http.post<Appuntamento[]>(this.cartella + 'Appuntamenti/PrenotazioneSemplice', p);
    } else {
      if (s.destinazione === 'Web') {
        return this.http.post<Appuntamento[]>(this.sitoWeb + this.cartella + 'planner/PrenotazioneSemplice', p);
      } else {
        return this.http.post<Appuntamento[]>(s.indirizzoIP + ':' + s.porta + 'planner/PrenotazioneSemplice', p);
      }
    }
  }

  getServiziInPlanner(s: Salone, txt: string): Observable<Servizio[]> {
    if (this.planner === 'web') {
      return this.http.get<Servizio[]>(this.cartella + 'Appuntamenti/ServiziInPlanner?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&txt=' + txt);
    } else {
      if (s.destinazione === 'Web') {
        return this.http.get<Servizio[]>(this.sitoWeb + this.cartella + 'planner/ServiziInPlanner?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&txt=' + txt);
      } else {
        return this.http.get<Servizio[]>(s.indirizzoIP + ':' + s.porta + 'planner/ServiziInPlanner?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&txt=' + txt);
      }
    }
  }

  getCliente(s: Salone, id: string): Observable<Cliente> {
    if (this.planner === 'web') {
      return this.http.get<Cliente>(this.cartella + 'Appuntamenti/ClientePlanner?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&id=' + id);
    } else {
      if (s.destinazione === 'Web') {
        return this.http.get<Cliente>(this.sitoWeb + this.cartella + 'planner/ClientePlanner?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&id=' + id);
      } else {
        return this.http.get<Cliente>(s.indirizzoIP + ':' + s.porta + 'planner/ClientePlanner?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&id=' + id);
      }
    }
  }

  getClienteOccasionale(s: Salone): Observable<Cliente> {
    if (this.planner === 'web') {
      return this.http.get<Cliente>(this.cartella + 'Appuntamenti/ClienteOccasionale?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione);
    } else {
      if (s.destinazione === 'Web') {
        return this.http.get<Cliente>(this.sitoWeb + this.cartella + 'planner/ClienteOccasionale?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione);
      } else {
        return this.http.get<Cliente>(s.indirizzoIP + ':' + s.porta + 'planner/ClienteOccasionale?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione);
      }
    }
  }

  getAppuntamento(s: Salone, id: string): Observable<Appuntamento> {
    const url = this.api + 'ListaEventi/' + id;
    if (this.planner === 'web') {
    } else {

      if (s.destinazione === 'Web') {
        return this.http.get<Appuntamento>(url);
      } else {
      }
    }
  }

  deleteEvent(s: Salone, id: string): Observable<Esito> {
    if (this.planner === 'web') {
      return this.http.get<Esito>(this.cartella + 'Appuntamenti/DeleteValue?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=web&id=' + id);
    } else {
      if (s.destinazione === 'Web') {
        return this.http.get<Esito>(this.sitoWeb + this.cartella + 'planner/DeleteValue?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&id=' + id);
      } else {
        return this.http.get<Esito>(s.indirizzoIP + ':' + s.porta + 'planner/listaCollaboratori?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Token=a&Posizione=' + s.destinazione + '&id=' + id);
      }
    }
  }

  postAppuntamento(s: Salone, app: Appuntamento): Observable<Appuntamento> {
    if (this.planner === 'web') {
      return this.http.post<Appuntamento>(this.cartella + 'Appuntamenti/PostValue/', app);
    } else {
      if (s.destinazione === 'Web') {
        return this.http.post<Appuntamento>(this.sitoWeb + this.cartella + 'planner/PostValue/', app);
      } else {
        return this.http.post<Appuntamento>(s.indirizzoIP + ':' + s.porta + '/planner/PostValue/', app);
      }
    }
  }

  updateAppuntamento(s: Salone, app: Appuntamento): Observable<Esito> {
    if (this.planner === 'web') {
      return this.http.post<Esito>(this.cartella + 'Appuntamenti/UpdateValue/', app);
    } else {
      if (s.destinazione === 'Web') {
        return this.http.post<Esito>(this.sitoWeb + this.cartella + 'planner/UpdateValue/', app);
      } else {
        return this.http.post<Esito>(s.indirizzoIP + ':' + s.porta + '/planner/UpdateValue/', app);
      }
    }
  }

  verificaSaloneFromToken(token: string): Observable<Salone> {
    return this.http.get<Salone>(this.cartella + 'Appuntamenti/VerificaTokenSalone?token=' + token);
  }

  getClienteFromCell(token: Salone, cell: string): Observable<Cliente> {
    return this.http.get<Cliente>(this.cartella + 'Appuntamenti/GetCliente?token=' + token + '&cell=' + cell);
  }

  salvaClienteTemporaneo(token: string, c: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.cartella + 'Appuntamenti/SalvaClienteTemporaneo/', c);
  }

  GetOpzioniPlanner(s: Salone): Observable<OpzioniPlanner> {
    return this.http.get<OpzioniPlanner>(this.cartella + 'Appuntamenti/GetOpzioniPlanner?gruppo=' + s.gruppo + '&salone=' + s.salone);
  }

  getEventsOfClient(c: User): Observable<Appuntamento[]> {
    return this.http.post<Appuntamento[]>(this.cartella + 'Appuntamenti/getEventsOfClient?', c);
  }

  richiediAnnullamento(e: Appuntamento): Observable<Esito> {
    return this.http.post<Esito>(this.cartella + 'Appuntamenti/RichiediAnnullamento?', e);
  }

  confermaAnnullamento(txt: string): Observable<Esito> {
    return this.http.get<Esito>(this.cartella + 'Appuntamenti/ConfermaAnnullamento?token=' + txt);
  }

  getUtentiPlanner(s: Salone, txt: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.cartella + 'Utenti/GetUtentiPlanner?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Txt=' + txt + '&Token=' + this.cc.getToken());
  }

  getUtentePlanner(s: Salone, id: string): Observable<Cliente> {
    return this.http.get<Cliente>(this.cartella + 'Utenti/GetUtentePlanner?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Id=' + id + '&Token=' + this.cc.getToken());
  }

  updateUtentePlanner(c: Cliente): Observable<Esito> {
    return this.http.post<Esito>(this.cartella + 'Utenti/UpdateUtentePlanner', c);
  }


}

