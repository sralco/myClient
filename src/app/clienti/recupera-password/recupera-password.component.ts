import { Location } from '@angular/common';
import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Esito } from 'src/app/Models/Esito';
import { SaloniService } from 'src/app/Services/saloni.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';
import { OpzioniPlanner } from 'src/app/Models/OpzioniPlanner';

@Component({
  selector: 'app-recupera-password',
  templateUrl: './recupera-password.component.html',
  styleUrls: ['./recupera-password.component.scss'],
  animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate('300ms ease-in', style({opacity: 1}))
      ]) 
    ])
  ]
})
export class RecuperaPasswordComponent implements OnInit {
  selectedStyle: string;
  @HostBinding('style') style: SafeStyle;

  gruppo: string = '';
  salone: string = '';
  emailInviata: boolean = false;
  alert: boolean = false;
  alertText: string = '';
  loading = false;
  submitted = false;
  email: string = '';
  loginForm: FormGroup;

  logoUrl:string = '';
  opzioniPlanner:OpzioniPlanner;

  constructor(private sanitizer: DomSanitizer, private loc: Location, private formBuilder: FormBuilder,
    private aRoute: ActivatedRoute,
    private route: Router,
    private notifier: NotifierService,
    private saloneService: SaloniService) {
    this.gruppo = localStorage.getItem('GruppoCliente');
    this.salone = localStorage.getItem('SaloneCliente');

    this.opzioniPlanner = JSON.parse(localStorage.getItem('OpzioniPlanner'));
    if (this.opzioniPlanner.logo && this.opzioniPlanner.logo != null && this.opzioniPlanner.logo != ''){
      this.logoUrl = '/images/PersonalizzazioniApp/' + (this.gruppo + '/' + this.salone + '/Skin/' + this.opzioniPlanner.logo).replace(/\s+/g, '_').toLowerCase();;
      //console.log(this.logoUrl)
    }

  }

  backgroundColor: string = '#000000';
  color: string = '#ffffff';

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
    });
    this.selectedStyle = `
    --background-color: ${this.backgroundColor};
    --color: ${this.color};
    `;
    this.style = this.sanitizer.bypassSecurityTrustStyle(this.selectedStyle);
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.saloneService.recuperaPassword(this.gruppo, this.salone, this.f.email.value, this.f.phone.value)
      .subscribe((data: Esito) => {
        if (data.esito === 'true') {
          this.notifier.notify('success', 'E\' stata inviata una email all\'indirizzo indicato contenente la password corretta');
          this.loading = false;
          this.emailInviata = true;
        } else {
          this.alert = true;
          this.alertText = "Utente non trovato";
          this.loading = false;
        }
      },
        error => {
          this.alert = true;
          this.alertText = error;
          this.loading = false;
        });
  }


  back() {
    this.loc.back();
  }

  removeAlert() {
    this.alert = false;
  }
  vai() {
    this.route.navigate(['mysaloon/' + this.gruppo], { replaceUrl: true });
  }

}
