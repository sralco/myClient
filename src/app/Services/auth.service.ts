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
export class AuthService {

  constructor(private http: HttpClient, private cc: ConstantsService, private router: Router) { }

  private isUserLogged = false;
  @Output() userLoggedin = new EventEmitter<User>();
  @Output() userLoggedup = new EventEmitter<User>();
  @Output() userlogout = new EventEmitter();

  api: string;
  public user:User;

  isUserLoggedIn() {
    this.isUserLogged = !!localStorage.getItem('token');
    return this.isUserLogged;
  }

  logIn<user>(uid: string, pwd: string) {
    console.log(this.cc.baseSqlUrl + 'api/utenti/Authenticate?uid=' + uid + '&pwd=' + pwd);

    return this.http.get<User>((this.cc.baseSqlUrl + 'api/utenti/Authenticate?uid=').replace('/api/api/','/api/') + uid + '&pwd=' + pwd)
      .pipe(map(user => {
        if (user.cognome) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('GruppoSaloni', uid);
          localStorage.setItem('token', 'true');
          this.user=user;
          return user;
        }
      }));
  }

  logOut() {
    localStorage.clear();
/*     localStorage.removeItem('saloneSelezionato');
    localStorage.removeItem('OpzioniPlanner');
    localStorage.removeItem('GruppoCliente');
    localStorage.removeItem('SaloneCliente');
    localStorage.removeItem('PlannerCorrente');
    localStorage.removeItem('UserCliente');
    localStorage.removeItem('Prenotazione'); */
    // localStorage.setItem('user', '');
    // localStorage.setItem('GruppoSaloni', '');
    // localStorage.removeItem('token');
    this.isUserLogged = false;
    this.router.navigate(['/login']);
    this.userlogout.emit();
  }

}
