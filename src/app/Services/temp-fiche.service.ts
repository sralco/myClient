import { ConstantsService } from './constants.service';
import { HttpClient, HttpHeaders } from '@angular/common/Http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TempFiche } from '../Models/Temp-Fiche';
import { Esito } from '../Models/Esito';

const httpOption = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class TempFicheService {

  private api = '';

  constructor(private http: HttpClient, private cc: ConstantsService) {
    if (!localStorage.getItem('BaseAppURL')) {
      localStorage.setItem('BaseAppURL', cc.baseAppUrl);
    }
    this.api = localStorage.getItem('BaseAppURL') + 'tempfiche/';
  }

  getTempFiches(): Observable<TempFiche[]> {
    return this.http.get<TempFiche[]>(this.api + 'lista');
  }

  getTempFiche(id: string): Observable<TempFiche> {
    const url = this.api + 'TempFicheSingola/' + id;
    return this.http.get<TempFiche>(url);
  }

  trovaTempFiche(txt: string): Observable<TempFiche[]> {
    const url = this.api + 'trovaTempFiche?txt=' + txt;
    console.log(url);
    return this.http.get<TempFiche[]>(url);
  }

  addProdotto(tipo: string, idTempFiche: string, idColl: string, idProdotto: string,
    qta: string, prezzo: string, sconto: string, listino: string): Observable<Esito> {
    const app = idColl + ';' + idProdotto + ';' + qta + ';' + prezzo + ';' + sconto + ';' + listino + '#';
    const url = this.api + 'InserisciProdottoInTempFiche?tipo=' + tipo + '&idtempfiche=' + idTempFiche + '&riga=' + app;
    console.log(url);
    return this.http.get<Esito>(url);
  }

  rimuoviProdottoDaTempFiche(tipo: string, idTempFiche: string, testo: string): Observable<Esito> {
    const url = this.api + 'rimuoviProdottodaTempFiche?tipo=' + tipo + '&idtempfiche=' + idTempFiche + '&riga=' + testo + '#';
    console.log(url);
    return this.http.get<Esito>(url);
  }

  disponibilePerApertura(id: string): Observable<Esito> {
    return this.http.get<Esito>(this.api + 'DisponibilePerApertura?id=' + id);
  }

  inserisciProposta(idCliente: string, idColl: string, idServizio: string, tipo: string): Observable<Esito> {
    return this.http.get<Esito>(this.api + 'InserisciProposta?IdCliente=' + idCliente + '&IdColl='+ idColl + '&IdServizio=' + idServizio + '&Tipo=' + tipo);
  }

}
