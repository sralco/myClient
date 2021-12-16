import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { SaloniService } from 'src/app/Services/saloni.service';
import { User } from 'src/app/Models/User';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

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
  styleUrls: ['./registrazione-clienti.component.scss']
})
export class RegistrazioneClientiComponent implements OnInit {
  selectedStyle: string;
  @HostBinding('style') style: SafeStyle;

  form: FormGroup;
  submitted = false;
  alert: boolean = false;
  alertText: string = '';
  loading = false;
  gruppo: string = '';
  salone: string = '';

  constructor(private sanitizer: DomSanitizer, private loc: Location, private saloni: SaloniService, private formBuilder: FormBuilder, private route: Router,) {
    this.gruppo = localStorage.getItem('GruppoCliente');
    this.salone = localStorage.getItem('SaloneCliente');
  }

  backgroundColor: string = '#008b8b';
  color: string = '#ffffff';

  ngOnInit() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(8), Validators.pattern("^[0-9]*$")]],
      email: ['', [Validators.required,]],// Validators.email
      pwd: ['', [Validators.required, Validators.minLength(2)]],
      pwd2: ['', Validators.required]
    }, {
      validator: MustMatch('pwd', 'pwd2')
    });
    this.selectedStyle = `
    --background-color: ${this.backgroundColor};
    --color: ${this.color};
    `;
    this.style = this.sanitizer.bypassSecurityTrustStyle(this.selectedStyle);
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {

    // stop here if form is invalid //this.form.invalid ||
    if (this.f.email.value === '' || this.f.pwd.value === '' || this.f.nome.value === '' || this.f.cognome.value === '' || this.f.phone.value === '') {
      alert('Tutti i campi sono obbligatori');
      return;
    }

    if (this.f.pwd.value !== this.f.pwd2.value) {
      alert('Le password non corrispondono');
      return;
    }
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

    this.saloni.addUserCliente(user).subscribe(
      (data: User) => {
        if (data.errorMessage !== null && data.errorMessage !== '') {
          this.loading = false;
          this.alert = true;
          this.alertText = data.errorMessage;
        } else {
          console.log(data);
          //localStorage.setItem("UserCliente", JSON.stringify(data));
          alert('Controlla la tua email per confermare la registrazione')
          this.route.navigate(['/loginclienti/' + this.gruppo + '/' + this.salone]);
        }
      },
      error => {
        this.alert = true;
        this.alertText = "Impossibile raggiungere il server"
        this.loading = false;
      });
  }

  removeAlert() {
    this.alert = false;
  }

  back() {
    this.loc.back();
  }

}
