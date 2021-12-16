import { ConstantsService } from './constants.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http';
import { Observable } from 'rxjs';
import { Spesa } from '../Models/Spesa';
import { Salone } from '../Models/Salone';
import { Esito } from '../Models/Esito';

@Injectable({
  providedIn: 'root'
})
export class SpeseService {

  private api = '';

  sitoWeb: string = 'https://www.gamainformatica.it/';
  cartella: string = 'mySAPI/api/';
  planner: string = 'web';

  constructor(private http: HttpClient, private cc: ConstantsService) {
    this.api = (cc.baseSqlUrl + 'api/spese/').replace('/api/api/','/api/');
    this.sitoWeb = cc.sitoWeb;
  }

  getSpese(s: Salone, data1: string,data2:string): Observable<Spesa[]> {
      return this.http.get<Spesa[]>(this.api + 'GetSpeseSql?gruppo=' + s.gruppo + '&salone=' + s.salone + '&data1=' + data1 + '&data2=' + data2);
  }
  addSpesa(s: Salone, spesa:Spesa): Observable<Esito> {
    spesa.gruppo=s.gruppo;
    spesa.salone=s.salone;
      return this.http.post<Esito>(this.api + 'SalvaNuovaSpesa',spesa);
  }

  getCategorie(gruppo:string,salone:string ): Observable<string[]> {
      return this.http.get<string[]>(this.api + 'ListaCategorie?gruppo=' + gruppo + '&salone=' + salone);
  }

  getSottoCategorie(gruppo:string,salone:string,categoria: string): Observable<string[]> {
      return this.http.get<string[]>(this.api + 'ListaSottoCategorie?gruppo=' + gruppo + '&salone=' + salone + '&categoria=' + categoria);
  }

  getDescrizioni(gruppo:string,salone:string,categoria: string,sottoCategoria:string): Observable<string[]> {
      return this.http.get<string[]>(this.api + 'ListaDescrizioni?gruppo=' + gruppo + '&salone=' + salone + '&categoria=' + categoria + '&sottoCategoria=' + sottoCategoria);
  }

  getModelliSpesa(gruppo:string,salone:string,descrizione: string): Observable<Spesa[]> {
      return this.http.get<Spesa[]>(this.api + 'ListaModelliSpesa?gruppo=' + gruppo + '&salone=' + salone + '&descrizione=' + descrizione);
  }

}
