import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Salone } from 'src/app/Models/Salone';
import { User } from 'src/app/Models/User';
import { AuthClientiService } from 'src/app/Services/auth-clienti.service';
import { Location } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';


@Component({
  selector: 'app-login-clienti',
  templateUrl: './login-clienti.component.html',
  styleUrls: ['./login-clienti.component.scss']
})
export class LoginClientiComponent implements OnInit {
  selectedStyle: string;
  @HostBinding('style') style: SafeStyle;

  gruppo: string = '';
  salone: string = '';
  user: User;
  email: string = '';
  hide = true;

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  alert: boolean = false;
  alertText: string = '';

  backgroundColor: string = '#000000';
  color: string = '#ffffff';
  backgroundUrl:string = '';
  logoUrl:string = '';

  constructor(
    private loc: Location,
    private formBuilder: FormBuilder,
    private aRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthClientiService,
    private notifier: NotifierService,
    private service: SaloniService,
    private sanitizer: DomSanitizer) {

    this.gruppo = this.aRoute.snapshot.paramMap.get('id1');
    this.salone = this.aRoute.snapshot.paramMap.get('id2');

    // redirect to home if already logged in
    if (this.auth.isUserLoggedIn) {
      const app = localStorage.getItem('UserCliente');
      if (!app) {
        this.router.navigate(['loginclienti/' + this.gruppo + '/' + this.salone]);
      } else {
        this.user = JSON.parse(app);
        if (!this.user) {
          this.router.navigate(['loginclienti/' + this.gruppo + '/' + this.salone]);
        }
      }

      let salone: Salone = new Salone();
      this.service.getSaloni(this.gruppo).subscribe(
        x => {
          x.forEach(element => {
            if (element.salone.toLowerCase() === this.salone.toLowerCase()) {
              salone = element;
              this.service.saloneCorrente = salone;
              localStorage.setItem('PlannerCorrente', salone.gruppo + ';' + salone.salone + ';' + salone.destinazione + ';' + salone.indirizzoIP + ';' + salone.porta + ';' + salone.posizionePlanner);
              localStorage.setItem('OpzioniPlanner', JSON.stringify(salone.opzioniPlanner));
              this.router.navigate(['prenotazioneclienti/' + this.salone]);
            } else {
              this.notifier.notify('warning', 'Salone non trovato');
            }
          });
        }, (err => {
          this.notifier.notify('warning', 'Salone non trovato');
        })
      );
      if (this.service.saloneCorrente.opzioniPlanner.logo && this.service.saloneCorrente.opzioniPlanner.logo != null && this.service.saloneCorrente.opzioniPlanner.logo != ''){
        this.logoUrl = '/images/PersonalizzazioniApp/' + (this.service.saloneCorrente.gruppo + '/' + this.service.saloneCorrente.salone + '/Skin/' + this.service.saloneCorrente.opzioniPlanner.logo).replace(/\s+/g, '_').toLowerCase();;
        console.log(this.logoUrl)
      }
    }


  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.selectedStyle = `
    --background-color: ${this.backgroundColor};
    --color: ${this.color};
    `;
    this.style = this.sanitizer.bypassSecurityTrustStyle(this.selectedStyle);


  }
  back() {
    this.loc.back();
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.auth.logIn(this.f.email.value, this.f.password.value, this.gruppo, this.salone)
      .subscribe((data: User) => {
        if (data.errorMessage) {
          this.alert = true;
          this.alertText = data.errorMessage
          this.loading = false;
        } else {
          this.user = data;
          localStorage.setItem('UserCliente', JSON.stringify(data));

          let salone: Salone = new Salone();
          this.service.getSaloni(this.gruppo).subscribe(
            x => {
              x.forEach(element => {
                if (element.salone.toLowerCase() === this.salone.toLowerCase()) {
                  console.log(x);
                  salone = element;
                  this.service.saloneCorrente = salone;
                  localStorage.setItem('PlannerCorrente', salone.gruppo + ';' + salone.salone + ';' + salone.destinazione + ';' + salone.indirizzoIP + ';' + salone.porta + ';' + salone.posizionePlanner);
                  localStorage.setItem('OpzioniPlanner', JSON.stringify(salone.opzioniPlanner));
                  this.router.navigate(['prenotazioneclienti/' + this.salone], { replaceUrl: true });
                }
              });
            }, (err => {
              this.notifier.notify('warning', 'Salone non trovato');
            })
          );

        }
      },
        error => {
          this.alert = true;
          this.alertText = error;
          this.loading = false;
        });
  }

  openRegister() {
    this.router.navigate(['registrazionecliente']);
  }

  openPasswordDimenticata() {
    this.router.navigate(['passwordDimenticata']);
  }

  removeAlert() {
    this.alert = false;
  }
}
