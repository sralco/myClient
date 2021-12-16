import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthClientiService } from './auth-clienti.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardClientiService {

  constructor(private auht: AuthClientiService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auht.isUserLoggedIn()) {
      return true;
    } else {

      let gruppo =next.paramMap.get('id1'); // localStorage.getItem('GruppoCliente');
      let salone = next.paramMap.get('id2');

      if (gruppo==='' || gruppo===null){
         gruppo = localStorage.getItem('GruppoCliente');
         salone = localStorage.getItem('SaloneCliente');
      }

      this.router.navigate(['loginclienti/' + gruppo + '/' + salone]);
    }
  }
}
