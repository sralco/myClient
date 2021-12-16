import { ConstantsService } from './constants.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http';
import { Observable } from 'rxjs';
import { Servizio } from './../Models/Servizio';

@Injectable({
  providedIn: 'root'
})
export class ServiziService {

  private api = '';

  constructor(private http: HttpClient, private cc: ConstantsService) {
    if (!localStorage.getItem('BaseAppURL')) {
      localStorage.setItem('BaseAppURL', cc.baseAppUrl);
    }
    this.api = localStorage.getItem('BaseAppURL') + 'prodotti/';
  }

  getServizi(tipo: string): Observable<Servizio[]> {
    return this.http.get<Servizio[]>(this.api + 'lista?tipo=servizi');
  }
  findServizi(testo: string): Observable<Servizio[]> {
    return this.http.get<Servizio[]>(this.api + 'lista?tipo=Servizi&testo=' + testo);
  }

  findServizioById(id: string): Observable<Servizio> {
    return this.http.get<Servizio>(this.api + 'lista?tipo=Servizi&id=' + id);
  }

}
