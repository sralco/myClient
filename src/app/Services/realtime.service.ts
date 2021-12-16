import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogEvento } from '../Models/LogEvento';
import { Pagamento } from '../Models/Pagamento';
import { Passaggio } from '../Models/Passaggio';
import { RealTime } from '../Models/RealTime';
import { Salone } from '../Models/Salone';
import { TempFiche } from '../Models/Temp-Fiche';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  private api = '';
  sitoWeb: string = 'https://www.gamainformatica.it/';
  cartella: string = 'mySAPI/api/';
  planner: string = 'web';

  constructor(private http: HttpClient, private cc: ConstantsService) {
    this.api = (cc.baseSqlUrl + 'api/Realtime/').replace('/api/api/','/api/');
    this.sitoWeb = cc.sitoWeb;
  }

  getRealTime(s: Salone): Observable<RealTime> {
      return this.http.get<RealTime>(this.api + 'GetRealTime?gruppo=' + s.gruppo + '&salone=' + s.salone);
  }
  getLogEventi(s: Salone): Observable<LogEvento[]> {
      return this.http.get<LogEvento[]>(this.api + 'GetLogEventi?gruppo=' + s.gruppo + '&salone=' + s.salone);
  }
  getInSala(s: Salone): Observable<TempFiche[]> {
      return this.http.get<TempFiche[]>(this.api + 'GetInSala?gruppo=' + s.gruppo + '&salone=' + s.salone);
  }
  getPassaggi(s: Salone): Observable<Passaggio[]> {
      return this.http.get<Passaggio[]>(this.api + 'GetPassaggi?gruppo=' + s.gruppo + '&salone=' + s.salone);
  }
  getIncassi(s: Salone): Observable<Pagamento[]> {
      return this.http.get<Pagamento[]>(this.api + 'GetIncassi?gruppo=' + s.gruppo + '&salone=' + s.salone);
  }

}
