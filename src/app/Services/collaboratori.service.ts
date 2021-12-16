import { ConstantsService } from './constants.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http';
import { Observable } from 'rxjs';
import { Collaboratore } from '../Models/Collaboratore';
import { Salone } from '../Models/Salone';

@Injectable({
  providedIn: 'root'
})
export class CollaboratoriService {

  api = '';

  constructor(private http: HttpClient, private cc: ConstantsService) {
    if (!localStorage.getItem('BaseAppURL')) {
      localStorage.setItem('BaseAppURL', cc.baseAppUrl);
    }
    this.api = localStorage.getItem('BaseAppURL') + 'collaboratori/';
  }

  getCollaboratori(): Observable<Collaboratore[]> {
    return this.http.get<Collaboratore[]>(this.api + 'lista');
  }

}
