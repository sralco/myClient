import { ConstantsService } from './constants.service';
import { HttpClient, HttpHeaders } from '@angular/common/Http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CoppiaChiaveValore } from '../Models/CoppiaChiaveValore';
import { Obiettivo } from '../Models/Obiettivo';

@Injectable({
  providedIn: 'root'
})
export class ObiettiviService {


  private api = '';

  constructor(private http: HttpClient, private cc: ConstantsService) {
    this.api = localStorage.getItem('BaseAppURL') + 'Obiettivi/';
    this.api =this.api.replace('mySApi','myIp').replace('mySapi','myIp').replace('mysapi','myIp').replace('mySAPI','myIp').replace('mySAPi','myIp');
    if (cc.posizione==='debug'){
      this.api='http://localhost:31277/api/Obiettivi/'
    }
 }

  getListaObiettivi(): Observable<CoppiaChiaveValore[]> {
    return this.http.get<CoppiaChiaveValore[]>(this.api + 'GetListaObiettivi');
  }
  getObiettivi(idCollaboratore: string, idObiettivo:string): Observable<Obiettivo[]> {
    return this.http.get<Obiettivo[]>(this.api + 'GetObiettivi?idCollaboratore=' + idCollaboratore + '&idObiettivo='+ idObiettivo);
  }
}
