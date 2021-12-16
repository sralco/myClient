import { User } from './../Models/User';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/Http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private api = '';

  constructor(private http: HttpClient, private cc: ConstantsService) {
    if (!localStorage.getItem('BaseAppURL')) {
      localStorage.setItem('BaseAppURL', cc.baseAppUrl);
    }
    this.api = localStorage.getItem('BaseAppURL') + 'users/';
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.api + 'lista');
  }

  getUser(user: string): Observable<User> {
    return this.http.get<User>(this.api + 'SingoloUtente/' + user);
  }

}
