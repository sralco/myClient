import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerSatisfactionService {
  private api = '';

  sitoWeb: string = 'https://www.gamainformatica.it/';
  cartella: string = 'myIP/api/';

  constructor(private http: HttpClient, private cc: ConstantsService) {
    this.api = (cc.baseSqlUrl + 'api/CustomerSatisfaction/').replace('/api/api/','/api/');
    this.sitoWeb = cc.sitoWeb;
  }

}
