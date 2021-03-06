import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { SaloniService } from 'src/app/Services/saloni.service';
import { User } from 'src/app/Models/User';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { OpzioniPlanner } from 'src/app/Models/OpzioniPlanner';
import { CercaCittaService } from 'src/app/Services/cercacitta.service';

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

@Component({
  selector: 'app-registrazione-clienti',
  templateUrl: './registrazione-clienti.component.html',
  styleUrls: ['./registrazione-clienti.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ])
    ])
  ],
})
export class RegistrazioneClientiComponent implements OnInit {
  option: any;
  public handleAddressChange(event: any) {

    this.citta.cerca(event.target.value).subscribe(x=>{
      this.option = x;
     // this.getitaly();
      console.log(x)
    })
  }

  selectedStyle: string;
  @HostBinding('style') style: SafeStyle;

  regClientiForm: FormGroup;
  submitted = false;
  alert: boolean = false;
  alertText: string = '';
  loading = false;
  gruppo: string = '';
  salone: string = '';
  attesa: boolean = true;

  opzioniPlanner: OpzioniPlanner;
  logoUrl: string = '';

  constructor(private _snackBar: MatSnackBar, private sanitizer: DomSanitizer, private loc: Location, private saloni: SaloniService, private formBuilder: FormBuilder, private route: Router, private citta: CercaCittaService) {
    this.gruppo = localStorage.getItem('GruppoCliente');
    this.salone = localStorage.getItem('SaloneCliente');

    this.opzioniPlanner = JSON.parse(localStorage.getItem('OpzioniPlanner'));
    if (this.opzioniPlanner.logo && this.opzioniPlanner.logo != null && this.opzioniPlanner.logo != '') {
      this.logoUrl = '/images/PersonalizzazioniApp/' + (this.gruppo + '/' + this.salone + '/Skin/' + this.opzioniPlanner.logo).replace(/\s+/g, '_').toLowerCase();;
      //console.log(this.logoUrl)
    }
  }

  backgroundColor: string = '#000000';
  color: string = '#ffffff';

  ngOnInit() {
    this.regClientiForm = new FormGroup({
      nome: new FormControl('', Validators.required),
      cognome: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern("^[0-9]*$")]),
      email: new FormControl('', [Validators.required,]),// Validators.email
      giorno: new FormControl(),
      mese: new FormControl(),
      anno: new FormControl(),
      paese: new FormControl(),
      pwd: new FormControl('', [Validators.required, Validators.minLength(2)]),
      pwd2: new FormControl('', Validators.required)
    });

    this.selectedStyle = `
    --background-color: ${this.backgroundColor};
    --color: ${this.color};
    `;

    this.style = this.sanitizer.bypassSecurityTrustStyle(this.selectedStyle);
    this.attesa = false;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  // convenience getter for easy access to form fields
  get f() { return this.regClientiForm.controls; }

  onSubmit() {

    // stop here if form is invalid //this.form.invalid ||
    if (this.f.email.value === '' || this.f.pwd.value === '' || this.f.nome.value === '' || this.f.cognome.value === '' || this.f.phone.value === '') {
      return;
    }

    // if (this.f.pwd.value !== this.f.pwd2.value) {
    //   alert('Le password non corrispondono');
    //   return;
    // }
    this.submitted = true;

    this.loading = true;
    const user: User = new User();
    user.gruppo = this.gruppo;
    user.salone = this.salone;
    user.email = this.f.email.value;
    user.pwd = this.f.pwd.value;
    user.nome = this.f.nome.value;
    user.cognome = this.f.cognome.value;
    user.cell = this.f.phone.value;
    user.paese = this.f.paese.value;
    user.compleanno = this.f.giorno.value + '/' + this.f.mese.value + '/' + this.f.anno.value;
    console.log(user)

    this.saloni.addUserCliente(user).subscribe(
      (data: User) => {
        if (data.errorMessage !== null && data.errorMessage !== '') {
          this.loading = false;
          this.alert = true;
          this.alertText = data.errorMessage;
        } else {
          console.log(data);
          //localStorage.setItem("UserCliente", JSON.stringify(data));
          this.alert = true;
          alert('Controlla la tua email per confermare la registrazione')
          //this.alertText = 'Controlla la tua email per confermare la registrazione';
          this.route.navigate(['/loginclienti/' + this.gruppo + '/' + this.salone]);
        }
      },
      error => {
        this.alert = true;
        this.alertText = "Impossibile raggiungere il server"
        this.loading = false;
        //this.openSnackBar(this.alertText, 'X');
      });
  }


  removeAlert() {
    this.alert = false;
  }

  back() {
    this.loc.back();
  }

}
