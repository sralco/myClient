import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantsService } from './constants.service';
import { Consulenza } from 'src/app/Models/Consulenza';
import { Esito } from '../Models/Esito';

@Injectable({
  providedIn: 'root'
})
export class ConsulenzeService {
  private api = '';
  constructor(private http: HttpClient, private cc: ConstantsService) {
    this.api = localStorage.getItem('BaseAppURL') + 'Consulenze/';
     this.api =this.api.replace('mySApi','myIp').replace('mySapi','myIp').replace('mysapi','myIp').replace('mySAPI','myIp').replace('mySAPi','myIp');
     if (cc.posizione==='debug'){
       this.api='http://localhost:31277/api/Consulenze/'
     }
  }

  getConsulenza(idCliente:string): Observable<Consulenza> {
    return this.http.get<Consulenza>(this.api + 'GetConsulenza?IdCliente=' + idCliente);
  }
  postConsulenza(consulenza: Consulenza): Observable<Esito> {
    console.log(consulenza);
    console.log(this.api + 'SalvaConsulenza',consulenza);
    return this.http.post<Esito>(this.api + 'SalvaConsulenza',consulenza);
  }
}
