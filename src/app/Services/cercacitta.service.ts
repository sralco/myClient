import { Injectable } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { User } from './../models/User';
import { ConstantsService } from 'src/app/Services/constants.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CercaCittaService {

  constructor(private http: HttpClient) { }

  cerca(txt: string) {

    return this.http.get<any>(('https://api.teleport.org/api/cities/?search=' + txt + '&embed=Italy'))
    // IzaSyA9KT7xiEec-c1MYtvDPETh_xQaPsnH-SA
  }

}