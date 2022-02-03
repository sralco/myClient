import { Injectable } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { User } from './../Models/User';
import { ConstantsService } from 'src/app/Services/constants.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthClientiService {
  public user: User;
  private isUserLogged = false;
  @Output() userLoggedin = new EventEmitter<User>();
  @Output() userLoggedup = new EventEmitter<User>();
  @Output() userlogout = new EventEmitter();
  gruppo: string;
  salone: string;

  constructor(private http: HttpClient, private cc: ConstantsService, private router: Router) {
    this.gruppo = localStorage.getItem('GruppoCliente');
    this.salone = localStorage.getItem('SaloneCliente');
  }

  isUserLoggedIn() {
    const app = localStorage.getItem('UserCliente');
    this.gruppo = localStorage.getItem('GruppoCliente');
    this.salone = localStorage.getItem('SaloneCliente');
    if (app) {
      const user: User = JSON.parse(app);
      if (user.gruppo.toLowerCase() === this.gruppo.toLowerCase() && user.salone.toLowerCase() === this.salone.toLowerCase()) {
        this.isUserLogged = true;
      } else {
        this.isUserLogged = false;
      }
    } else {
      this.isUserLogged = false;
    }
    return this.isUserLogged;
  }

  logIn<user>(email: string, pwd: string, gruppo: string, salone: string) {
    let u: User = new User();
    u.email = email;
    u.pwd = pwd;
    u.gruppo = gruppo;
    u.salone = salone;
    return this.http.post<User>((this.cc.baseSqlUrl + 'api/utenti/AuthenticateClientePlanner').replace('/api/api/', '/api/'), u)
      .pipe(map(user => {
        if (user.cognome && user.cognome !== '') {
          localStorage.setItem('UserCliente', JSON.stringify(user));
          this.user = user;
          return user;
        } else {
          u.email = '';
          u.pwd = '';
          u.cognome = '';
          u.errorMessage = user.errorMessage;
          return u
        }
      }));
  }

  logOut() {
    localStorage.clear();
    this.isUserLogged = false;
    this.router.navigate(['/mysaloon/' + this.gruppo]);

    this.userlogout.emit();

  }

}
