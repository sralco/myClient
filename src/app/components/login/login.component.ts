import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { NotifierService } from 'angular-notifier';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Salone } from 'src/app/Models/Salone';
import { User } from 'src/app/Models/User';
import { OpzioniPlanner } from 'src/app/Models/OpzioniPlanner';

@Component({ 
  templateUrl: 'login.component.html' ,
  styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit {

  titolo: string;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  alert: boolean = false;
  alertText: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private notifier: NotifierService,
    private service: SaloniService,
  ) {
    // redirect to home if already logged in
    if (this.auth.isUserLoggedIn) {
      const app=localStorage.getItem('user');
      if (!app){
        return;
      }
      const user:User=JSON.parse(app);
      if (!user){
        return;
      }
      if (user.tipo===null){
        user.tipo==='';
      }
      if (user.tipo === 'Receptionist') {
        let salone: Salone = new Salone();
        this.service.getSaloni(user.gruppo).subscribe(
          x => {
            console.log(x);
            x.forEach(element => {
              if (element.salone === user.salone) {
                salone = element;
                this.service.saloneCorrente = salone;
                localStorage.setItem('PlannerCorrente', salone.gruppo + ';' + salone.salone + ';' + salone.destinazione + ';' + salone.indirizzoIP + ';' + salone.porta + ';' + salone.posizionePlanner);
                localStorage.setItem('OpzioniPlanner', JSON.stringify(salone.opzioniPlanner));
                this.router.navigate(['planner'], { replaceUrl: true });
              }
            });
          }, (err => {
            this.notifier.notify('warning', 'Salone non trovato');
          })
        );

      } else if (this.auth.user.tipo === 'Collaboratore') {

      } else {
        if (!!localStorage.getItem('ModalitaConsulente')) {
          this.router.navigate(['super/' + localStorage.getItem('Consulente')], { replaceUrl: true });
        } else {
          this.router.navigate(['/saloni'], { replaceUrl: true });
        }
      }
    }
   
  }

  ngOnInit() {

    this.titolo = localStorage.getItem('GruppoSaloni');
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
    this.auth.logIn(this.f.username.value, this.f.password.value)
      .subscribe(data => {
        console.log(data);
        if (data) {
          if (data.super) {
            localStorage.setItem('Consulente', this.f.username.value);
            localStorage.setItem('ModalitaConsulente', 'true');
            this.router.navigate(['super/' + this.f.username.value], { replaceUrl: true });
          } else {
            localStorage.setItem('Consulente', '');
            localStorage.setItem('ModalitaConsulente', '');
            if (data.tipo==='Receptionist'){
              let salone: Salone = new Salone();
              this.service.getSaloni(data.gruppo).subscribe(
                x => {
                  x.forEach(element => {
                    if (element.salone === data.salone) {
                      salone = element;
                      this.service.saloneCorrente = salone;
                      localStorage.setItem('PlannerCorrente', salone.gruppo + ';' + salone.salone + ';' + salone.destinazione + ';' + salone.indirizzoIP + ';' + salone.porta + ';' + salone.posizionePlanner);
                      localStorage.setItem('OpzioniPlanner', JSON.stringify(salone.opzioniPlanner));
                      this.router.navigate(['planner'], { replaceUrl: true });
                    }
                  });
                }, (err => {
                  this.notifier.notify('warning', 'Salone non trovato');
                })
              );

            }else if (data.tipo==='Collaboratore'){

            } else {
              console.log('saloni');
            this.router.navigate(['/saloni'], { replaceUrl: true });
            }
          }
        } else {
          this.alert = true;
          this.alertText = "Nome utente e password non validi"
          this.loading = false;
        }
      },
        error => {
          this.alert = true;
          this.alertText = "Impossibile raggiungere il server"
          this.loading = false;
        });
  }

  openRegister() {
    this.router.navigate(['/register']);
  }

  removeAlert() {
    this.alert = false;
  }
}

