import { ConstantsService } from './constants.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http';
import { Observable } from 'rxjs';
import { Prodotto } from './../Models/Prodotto';

@Injectable({
  providedIn: 'root'
})
export class ProdottiService {

  private api = '';

  constructor(private http: HttpClient, private cc: ConstantsService) {
    if (!localStorage.getItem('BaseAppURL')) {
      localStorage.setItem('BaseAppURL', cc.baseAppUrl);
    }
    this.api = localStorage.getItem('BaseAppURL') + 'prodotti/';
  }

  getProdotti(tipo: string): Observable<Prodotto[]> {
    return this.http.get<Prodotto[]>(this.api + 'lista?tipo=Prodotti');
  }
  findProdotti(testo: string): Observable<Prodotto[]> {
    return this.http.get<Prodotto[]>(this.api + 'lista?tipo=Prodotti&testo=' + testo);
  }

  findProdottoById(id: string): Observable<Prodotto> {
    return this.http.get<Prodotto>(this.api + 'lista?tipo=Prodotti&id=' + id);
  }

}
