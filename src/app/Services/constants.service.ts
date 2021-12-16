import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ConstantsService {

  readonly posizione: string = 'debug';
  public baseAppUrl: string = '';
  public baseSqlUrl: string = '';
  public sitoWeb: string = 'https://www.gamainformatica.it/';
  public cartella: string = 'mySAPI/api/';
  public baseLocalSqlUrl: string = '';

  constructor() {
    if (this.posizione === 'debug') {
      this.baseAppUrl = 'https://localhost:44351/api/';
      this.baseSqlUrl = 'http://localhost:31277/api/';
      this.baseLocalSqlUrl = 'http://localhost:31277/';
      this.sitoWeb = 'https://localhost:44351/';
      this.cartella = 'api/';
    } else if (this.posizione === 'locale') {
      this.baseAppUrl = 'http://localhost/mySapi/api/';
      this.baseSqlUrl = 'https://localhost:44351/';
    } else if (this.posizione === 'produzione') {
      this.baseAppUrl = 'http://192.168.1.2/mySapi/api/';
      this.baseSqlUrl = this.sitoWeb + 'myip/';
      this.baseLocalSqlUrl = 'http://192.168.1.2/myIP/api/';
    }

    this.baseSqlUrl = this.baseSqlUrl.replace('/api/api/', '/api/');
  }

  fDateEN(data: Date): string {
    const dd = String(data.getDate()).padStart(2, '0');
    const mm = String(data.getMonth() + 1).padStart(2, '0'); //  Gennaio è 0!!!!!!
    const yyyy = data.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
  }

  fDateIT(data: Date): string {
    const dd = String(data.getDate()).padStart(2, '0');
    const mm = String(data.getMonth() + 1).padStart(2, '0'); //  Gennaio è 0!
    const yyyy = data.getFullYear();

    return dd + '/' + mm + '/' + yyyy;
  }

  getToken(): string {
    return '';
  }

  replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
  }

}
