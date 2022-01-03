import { Cliente } from './../Models/Cliente';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http';
import { Observable } from 'rxjs';
import { ConstantsService } from './constants.service';
import { Esito } from '../Models/Esito';
import { Salone } from '../Models/Salone';


@Injectable({
  providedIn: 'root'
})
export class ClientiService {

  api = '';
  sqlApi='';

  constructor(private http: HttpClient, private cc: ConstantsService) {
    if (!localStorage.getItem('BaseAppURL')) {
      localStorage.setItem('BaseAppURL', cc.baseAppUrl);
    }
    this.api = localStorage.getItem('BaseAppURL') + 'clienti/';
    this.sqlApi=(cc.baseSqlUrl + 'api/Clienti/').replace('/api/api/','/api/');
  }

  getClienti(txt: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.api + 'lista?txt=' + txt);
  }

  getCliente(id: string, s: Salone): Observable<Cliente> {
/*     if (s) {
      this.api = s.indirizzoIP + ':' + s.porta + '/api/clienti/';
    }
 */  
    console.log(location.href)
    if (location.href.startsWith('https://www')){

      return this.http.get<Cliente>(this.sqlApi.replace('myip', 'mySapi') + 'lista?txt=&id=' + id);
  
   } else {
        return this.http.get<Cliente>(this.api + 'lista?txt=&id=' + id);
 
   }
  }

  getClientiIniziali(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.api + 'iniziali');
  }

  nuovoIngressoCliente(idCliente: string): Observable<Esito> {
    console.log('Api nuovo ingresso: ' + this.api + 'nuovoingresso?IdCliente=' + idCliente);
    return this.http.get<Esito>(this.api + 'nuovoingresso?IdCliente=' + idCliente);
  }

  salvaCliente(cliente: Cliente): Observable<Esito> {
   // console.log(this.api + 'postValue' + ' - ' + JSON.stringify(cliente));
    return this.http.post<Esito>(this.api + 'postValue', cliente);
  }

  salvaClienteAccess(cliente: Cliente): Observable<Esito> {
   // console.log(this.api + 'postValue' + ' - ' + JSON.stringify(cliente));
   let url :string = localStorage.getItem('BaseAppURL').toLowerCase().replace('mysapi','myIP');
   return this.http.post<Esito>(url + 'utenti/SalvaClienteAccess', cliente);
  }


  salvaFoto(cliente:Cliente): Observable<Esito> {
   // console.log(this.api + 'postValue' + ' - ' + JSON.stringify(cliente));
   let url :string=this.cc.baseLocalSqlUrl;
   if (!url.endsWith('api/')){
    url=this.cc.baseLocalSqlUrl + 'api/';
   }

    return this.http.post<Esito>(url + 'utenti/SalvaFoto', cliente);
  }

  getClientiDelSalone(s:Salone, txt:string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.sqlApi + 'GetClienti?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&txt=' + txt);
  }

  getClienteDelSalone(s:Salone, id:string): Observable<Cliente> {
    return this.http.get<Cliente>(this.sqlApi + 'GetCliente?Gruppo=' + s.gruppo + '&Salone=' + s.salone + '&Id=' + id);
  }

}
