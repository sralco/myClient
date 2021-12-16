import { ConstantsService } from './constants.service';
import { SchedaTecnica } from './../Models/SchedaTecnica';
import { HttpClient, HttpHeaders } from '@angular/common/Http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Esito } from '../Models/Esito';

const httpOption = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SchedeTecnicheService {

  private api = '';

  constructor(private http: HttpClient, private cc: ConstantsService) {
    if (!localStorage.getItem('BaseAppURL')) {
      localStorage.setItem('BaseAppURL', cc.baseAppUrl);
    }
    this.api = localStorage.getItem('BaseAppURL') + 'schedetecniche/';
  }

  getSchedeTecniche(idCliente: string): Observable<SchedaTecnica[]> {
    console.log(this.api + 'lista?idcliente=' + idCliente);
    return this.http.get<SchedaTecnica[]>(this.api + 'lista?idcliente=' + idCliente);
  }

  getSchedaTecnica(id: string): Observable<SchedaTecnica> {
    const url = this.api + 'lista/' + id;
    return this.http.get<SchedaTecnica>(url);
  }

  addSchedaTecnica(idCliente: string, testo: string): Observable<Esito> {
    const url = this.api + 'Inserisci?idCliente=' + idCliente + '&testo=' + encodeURIComponent(testo);
    return this.http.get<Esito>(url);
  }

  updateSchedaTecnica(id: string, testo: string): Observable<Esito> {
    const url = this.api + 'Aggiorna?id=' + id + '&testo=' + encodeURIComponent(testo);
    return this.http.get<Esito>(url);
  }

}
