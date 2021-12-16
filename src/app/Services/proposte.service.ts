import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Esito } from '../Models/Esito';
import { Proposta } from '../Models/Proposta';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class ProposteService {

  private api = '';

  constructor(private http: HttpClient, private cc: ConstantsService) {
    this.api = localStorage.getItem('BaseAppURL') + 'Proposte/';
  }

  getProposte(idCliente:string): Observable<Proposta[]> {
    return this.http.get<Proposta[]>(this.api + 'GetProposte?IdCliente=' + idCliente);
  }

  getProposteAperte(idCliente:string): Observable<Proposta[]> {
    return this.http.get<Proposta[]>(this.api + 'getProposteAperte?IdCliente=' + idCliente);
  }

  addProposta(p: Proposta): Observable<Proposta> {
    const param=JSON.stringify(p);
    return this.http.get<Proposta>(this.api + 'AddProposta?Parametri='+ param);
  }

  accettaProposta(p: Proposta): Observable<Esito> {
    return this.http.get<Esito>(this.api + 'AccettaProposta?id=' + p.id);
  }

  rifiutaProposta(p: Proposta): Observable<Esito> {
    return this.http.get<Esito>(this.api + 'RifiutaProposta?id=' + p.id);
  }

  apriProposta(p: Proposta): Observable<Esito> {
    return this.http.get<Esito>(this.api + 'ApriProposta?id=' + p.id);
  }
}
